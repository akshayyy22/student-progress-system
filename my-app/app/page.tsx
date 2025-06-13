'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  Box,
  Button,
  Snackbar
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

import AddStudentModal from '@/components/AddStudentModal';
import EditStudentModal from '@/components/EditStudentModal';
import StudentTable from '@/components/StudentTable';
import { useRouter } from 'next/navigation';

interface Student {
  _id: string;
  name: string;
  email: string;
  phone: string;
  codeforcesHandle: string;
  currentRating?: number;
  maxRating?: number;
}

export default function HomePage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [openAdd, setOpenAdd] = useState(false);
  const [editStudent, setEditStudent] = useState<Student | null>(null);
  const [snackbar, setSnackbar] = useState('');
  const router = useRouter();

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
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Student Progress Management
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenAdd(true)}
        >
          Add Student
        </Button>
      </Box>

      <StudentTable
        students={students}
        onEdit={(student) => setEditStudent(student)}
        onDelete={() => {
          fetchStudents();
          setSnackbar('Student deleted successfully!');
        }}
        onViewProfile={handleViewProfile}
      />

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
      />
    </Container>
  );
}
