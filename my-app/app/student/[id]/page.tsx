

'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import {
  Container, Typography, Box, ToggleButtonGroup, ToggleButton,
  Table, TableHead, TableRow, TableCell, TableBody, useTheme, Paper, Divider
} from '@mui/material';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';
import dynamic from 'next/dynamic';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const Heatmap = dynamic(() => import('@/components/SubmissionHeatmap'), {
  ssr: false,
  loading: () => <p>Loading heatmap...</p>,
});

export default function StudentProfilePage() {
  const theme = useTheme();
  const params = useParams();
  const id = params?.id as string;

  const [student, setStudent] = useState<any>(null);
  const [contestFilter, setContestFilter] = useState('30');
  const [problemFilter, setProblemFilter] = useState('30');
  const [contestHistory, setContestHistory] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);

  const fetchStudent = async () => {
    const res = await axios.get(`/api/students/${id}`);
    setStudent(res.data);
  };

  const fetchContestHistory = async () => {
    if (!student?.codeforcesHandle) return;
    const res = await axios.get(`https://codeforces.com/api/user.rating?handle=${student.codeforcesHandle}`);
    const data = res.data.result;
    const filtered = data.filter((c: any) => {
      const contestDate = new Date(c.ratingUpdateTimeSeconds * 1000);
      const daysAgo = (Date.now() - contestDate.getTime()) / (1000 * 60 * 60 * 24);
      return daysAgo <= parseInt(contestFilter);
    });
    const status = await axios.get(`https://codeforces.com/api/user.status?handle=${student.codeforcesHandle}`);
    const submissions = status.data.result;
    const solvedSet = new Set(submissions.filter((s : any) => s.verdict === 'OK').map((s : any) => `${s.problem.contestId}-${s.problem.index}`));

    const enhanced = await Promise.all(filtered.map(async (c : any) => {
      try {
        const res = await axios.get(`https://codeforces.com/api/contest.standings?contestId=${c.contestId}&from=1&count=1`);
        const problems = res.data.result.problems;
        const unsolvedCount = problems.filter((p : any) => !solvedSet.has(`${p.contestId}-${p.index}`)).length;
        return { ...c, unsolvedCount };
      } catch (e) {
        return { ...c, unsolvedCount: 'N/A' };
      }
    }));

    setContestHistory(enhanced);
  };

  const fetchProblemStats = async () => {
    if (!student?.codeforcesHandle) return;
    const res = await axios.get(`https://codeforces.com/api/user.status?handle=${student.codeforcesHandle}`);
    const data = res.data.result;
    const now = Date.now();
    const cutoffDays = parseInt(problemFilter);
    const filtered = data.filter((s: any) => {
      const date = s.creationTimeSeconds * 1000;
      const daysAgo = (now - date) / (1000 * 60 * 60 * 24);
      return s.verdict === 'OK' && daysAgo <= cutoffDays;
    });

    const seen = new Set();
    const ratingCounts: Record<number, number> = {};
    let totalRating = 0;
    let hardest = { rating: 0, name: '' };

    for (let s of filtered) {
      const key = `${s.problem.contestId}-${s.problem.index}`;
      if (!seen.has(key)) {
        seen.add(key);
        const r = s.problem.rating || 0;
        const name = s.problem.name;
        ratingCounts[r] = (ratingCounts[r] || 0) + 1;
        totalRating += r;
        if (r > hardest.rating) hardest = { rating: r, name };
      }
    }

    const avgRating = seen.size > 0 ? totalRating / seen.size : 0;
    const avgPerDay = seen.size / cutoffDays;

    setStats({
      totalSolved: seen.size,
      avgRating,
      avgPerDay,
      hardest,
      ratingCounts,
      heatmapData: filtered
    });
  };

  useEffect(() => {
    if (id) fetchStudent();
  }, [id]);

  useEffect(() => {
    if (student) {
      fetchContestHistory();
      fetchProblemStats();
    }
  }, [student, contestFilter, problemFilter]);

  return (
    <Container sx={{ mt: 6, mb: 6, maxWidth: '1000px' }}>
      {student ? (
        <Paper
          elevation={3}
          sx={{
            p: 4,
            borderRadius: '20px',
            background: theme.palette.mode === 'dark'
              ? 'rgba(255, 255, 255, 0.05)'
              : 'rgba(255, 255, 255, 0.65)',
            backdropFilter: 'blur(12px)',
            boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
            transition: 'all 0.3s ease-in-out',
          }}
        >
          <Typography variant="h4" fontWeight={600} gutterBottom>
            👤 {student.name}
          </Typography>
          <Typography variant="subtitle1" sx={{ mb: 3, color: 'text.secondary' }}>
            Codeforces Handle: <strong>{student.codeforcesHandle}</strong>
          </Typography>

          <Divider sx={{ mb: 3 }} />

          {/* Contest History */}
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>📊 Contest History</Typography>
            <ToggleButtonGroup
              value={contestFilter}
              exclusive
              onChange={(e, val) => val && setContestFilter(val)}
              sx={{ mb: 2 }}
              size="small"
              color="primary"
            >
              <ToggleButton value="30">Last 30 days</ToggleButton>
              <ToggleButton value="90">Last 90 days</ToggleButton>
              <ToggleButton value="365">Last 365 days</ToggleButton>
            </ToggleButtonGroup>

            <Bar
              data={{
                labels: contestHistory.map(c => c.contestName),
                datasets: [{
                  label: 'Rating',
                  data: contestHistory.map(c => c.newRating),
                  backgroundColor: '#42a5f5'
                }]
              }}
              options={{
                responsive: true,
                plugins: {
                  legend: { display: false }
                }
              }}
            />

            <Table sx={{ mt: 2 }} size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Contest</TableCell>
                  <TableCell>Rank</TableCell>
                  <TableCell>Δ Rating</TableCell>
                  <TableCell>Unsolved</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {contestHistory.map((c, i) => (
                  <TableRow key={i}>
                    <TableCell>{c.contestName}</TableCell>
                    <TableCell>{c.rank}</TableCell>
                    <TableCell>{c.newRating - c.oldRating}</TableCell>
                    <TableCell>{c.unsolvedCount}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>

          {/* Problem Stats */}
          <Box sx={{ mt: 6 }}>
            <Typography variant="h6" gutterBottom>🧠 Problem Solving Stats</Typography>
            <ToggleButtonGroup
              value={problemFilter}
              exclusive
              onChange={(e, val) => val && setProblemFilter(val)}
              sx={{ mb: 2 }}
              size="small"
              color="primary"
            >
              <ToggleButton value="7">Last 7 days</ToggleButton>
              <ToggleButton value="30">Last 30 days</ToggleButton>
              <ToggleButton value="90">Last 90 days</ToggleButton>
            </ToggleButtonGroup>

            {stats && (
              <Box>
                <Typography>Total Solved: <strong>{stats.totalSolved}</strong></Typography>
                <Typography>Average Rating: <strong>{stats.avgRating.toFixed(2)}</strong></Typography>
                <Typography>Problems/Day: <strong>{stats.avgPerDay.toFixed(2)}</strong></Typography>
                <Typography>Hardest Problem: <strong>{stats.hardest.name} ({stats.hardest.rating})</strong></Typography>

                <Bar
                  data={{
                    labels: Object.keys(stats.ratingCounts),
                    datasets: [{
                      label: 'Solved',
                      data: Object.values(stats.ratingCounts),
                      backgroundColor: '#66bb6a'
                    }]
                  }}
                  options={{ responsive: true }}
                />

                <Box sx={{ mt: 4 }}>
                  <Heatmap submissions={stats.heatmapData} />
                </Box>
              </Box>
            )}
          </Box>
        </Paper>
      ) : (
        <Typography>Loading...</Typography>
      )}
    </Container>
  );
}
