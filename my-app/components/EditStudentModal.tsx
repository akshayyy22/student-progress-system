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
  
  export default function EditStudentModal({ student, onClose, onUpdated }: EditStudentModalProps) {
    const [form, setForm] = useState<Student>({
      _id: '',
      name: '',
      email: '',
      phone: '',
      codeforcesHandle: '',
      currentRating: 0,
      maxRating: 0,
    });
  
    useEffect(() => {
      if (student) setForm(student);
    }, [student]);
  
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setForm((prev) => ({
        ...prev,
        [name]: name === 'currentRating' || name === 'maxRating' ? Number(value) : value,
      }));
    };
  
    const handleSubmit = async () => {
      try {
        await axios.put(`/api/students/${student?._id}`, form);
        onUpdated();   // Refresh student list
        onClose();     // Close modal
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
            name="currentRating"
            label="Current Rating"
            type="number"
            value={form.currentRating ?? ''}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            margin="normal"
            name="maxRating"
            label="Max Rating"
            type="number"
            value={form.maxRating ?? ''}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>Update</Button>
        </DialogActions>
      </Dialog>
    );
  }
  