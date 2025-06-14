'use client';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from '@mui/material';
import { useEffect, useState } from 'react';
import axios from 'axios';

interface Student {
  _id: string;
  name: string;
  email: string;
  phone: string;
  codeforcesHandle: string;
  currentRating?: number;
  maxRating?: number;
}

interface EditStudentModalProps {
  student: Student | null;
  onClose: () => void;
  onUpdated: () => void;
}

export default function EditStudentModal({
  student,
  onClose,
  onUpdated,
}: EditStudentModalProps) {
  const [form, setForm] = useState<Student>({
    _id: '',
    name: '',
    email: '',
    phone: '',
    codeforcesHandle: '',
  });

  useEffect(() => {
    if (student) {
      setForm(student);
    }
  }, [student]);

  // Fetch ratings from Codeforces when handle changes
  useEffect(() => {
    const fetchRatings = async () => {
      if (!form.codeforcesHandle) return;
      try {
        const res = await axios.get(
          `https://codeforces.com/api/user.info?handles=${form.codeforcesHandle}`
        );
        const user = res.data.result[0];
        setForm((prev) => ({
          ...prev,
          currentRating: user.rating,
          maxRating: user.maxRating,
        }));
      } catch (error) {
        console.error('Invalid Codeforces handle or API error', error);
        setForm((prev) => ({
          ...prev,
          currentRating: undefined,
          maxRating: undefined,
        }));
      }
    };

    fetchRatings();
  }, [form.codeforcesHandle]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      await axios.put(`/api/students/${student?._id}`, form);
      await axios.post(`/api/students/${student?._id}/resync`); // <-- Manual re-sync trigger
      onUpdated();
      onClose();
    } catch (error) {
      console.error('Error updating student:', error);
    }
  };


  

  return (
    <Dialog open={!!student} onClose={onClose}>
      <DialogTitle>Edit Student</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          margin="normal"
          name="name"
          label="Name"
          value={form.name}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          margin="normal"
          name="email"
          label="Email"
          value={form.email}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          margin="normal"
          name="phone"
          label="Phone"
          value={form.phone}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          margin="normal"
          name="codeforcesHandle"
          label="Codeforces Handle"
          value={form.codeforcesHandle}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Current Rating"
          value={form.currentRating ?? 'Fetching...'}
          InputProps={{ readOnly: true }}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Max Rating"
          value={form.maxRating ?? 'Fetching...'}
          InputProps={{ readOnly: true }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>
          Update
        </Button>
      </DialogActions>
    </Dialog>
  );
}
