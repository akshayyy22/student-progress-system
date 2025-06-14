'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  Box,
  Button,
  Snackbar,
  useTheme,
  Paper,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

import AddStudentModal from '@/components/AddStudentModal';
import EditStudentModal from '@/components/EditStudentModal';
import StudentTable from '@/components/StudentTable';
import { useRouter } from 'next/navigation';
import { Student } from '@/app/types/Student';

// interface Student {
//   _id: string;
//   name: string;
//   email: string;
//   phone: string;
//   codeforcesHandle: string;
//   currentRating?: number;
//   maxRating?: number;
//   lastSynced?: string;
//   remindersSent?: number;
//   autoReminder?: boolean;
// }

export default function HomePage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [openAdd, setOpenAdd] = useState(false);
  const [editStudent, setEditStudent] = useState<Student | null>(null);
  const [snackbar, setSnackbar] = useState('');
  const router = useRouter();
  const theme = useTheme();

  const fetchStudents = async () => {
    try {
      const res = await axios.get('/api/students');
      setStudents(res.data);
    } catch (err) {
      console.error('Error fetching students:', err);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleViewProfile = (id: string) => {
    router.push(`/student/${id}`);
  };

  return (
    <Container
      maxWidth="lg"
      sx={{
        mt: 6,
        mb: 6,
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
        backdropFilter: 'blur(16px)',
      }}
    >
      <Paper
        elevation={theme.palette.mode === 'dark' ? 3 : 1}
        sx={{
          p: 4,
          borderRadius: '20px',
          background: theme.palette.mode === 'dark'
            ? 'rgba(30,30,30,0.6)'
            : 'rgba(255,255,255,0.6)',
          backdropFilter: 'blur(12px)',
          border: theme.palette.mode === 'dark'
            ? '1px solid rgba(255,255,255,0.1)'
            : '1px solid rgba(0,0,0,0.05)',
          boxShadow: theme.palette.mode === 'dark'
            ? '0 4px 20px rgba(0,0,0,0.3)'
            : '0 4px 20px rgba(0,0,0,0.1)',
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h4" fontWeight={600}>
            Student Progress Management
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenAdd(true)}
            sx={{
              textTransform: 'none',
              fontWeight: 500,
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            }}
          >
            Add Student
          </Button>
        </Box>

        <Box
          sx={{
            mt: 2,
            borderRadius: '16px',
            overflow: 'hidden',
          }}
        >
          <StudentTable
            students={students}
            onEdit={(student) => setEditStudent(student)}
            onDelete={() => {
              fetchStudents();
              setSnackbar('Student deleted successfully!');
            }}
            onViewProfile={handleViewProfile}
          />
        </Box>
      </Paper>

      <AddStudentModal
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        onAdded={() => {
          fetchStudents();
          setSnackbar('Student added successfully!');
        }}
      />

      <EditStudentModal
        student={editStudent}
        onClose={() => setEditStudent(null)}
        onUpdated={() => {
          fetchStudents();
          setSnackbar('Student updated successfully!');
        }}
      />

      <Snackbar
        open={!!snackbar}
        autoHideDuration={3000}
        message={snackbar}
        onClose={() => setSnackbar('')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />


    </Container>
    
  );
}
