'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import {
  Container, Typography, Box, ToggleButtonGroup, ToggleButton
} from '@mui/material';

export default function StudentProfilePage() {
  const params = useParams();
  const id = params?.id as string;

  const [student, setStudent] = useState<any>(null);
  const [filter, setFilter] = useState('30');

  const fetchStudent = async () => {
    const res = await axios.get(`/api/students/${id}`);
    setStudent(res.data);
  };

  useEffect(() => {
    if (id) fetchStudent();
  }, [id]);

  return (
    <Container sx={{ mt: 4 }}>
      {student ? (
        <>
          <Typography variant="h4">{student.name}'s Profile</Typography>
          <Typography variant="subtitle1" gutterBottom>
            Codeforces Handle: {student.codeforcesHandle}
          </Typography>

          <Box sx={{ mt: 4 }}>
            <Typography variant="h6">Contest History</Typography>
            <ToggleButtonGroup
              value={filter}
              exclusive
              onChange={(e, newVal) => newVal && setFilter(newVal)}
              sx={{ mb: 2 }}
            >
              <ToggleButton value="30">Last 30 days</ToggleButton>
              <ToggleButton value="90">Last 90 days</ToggleButton>
              <ToggleButton value="365">Last 365 days</ToggleButton>
            </ToggleButtonGroup>
           
          </Box>

          <Box sx={{ mt: 4 }}>
            <Typography variant="h6">Problem Solving Data</Typography>
          </Box>
        </>
      ) : (
        <Typography>Loading...</Typography>
      )}
    </Container>
  );
}
