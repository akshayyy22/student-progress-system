import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
  } from '@mui/material';
  import { useState } from 'react';
  import axios from 'axios';
  
  export default function AddStudentModal({ open, onClose, onAdded }: any) {
    const [form, setForm] = useState({
      name: '',
      email: '',
      phone: '',
      codeforcesHandle: '',
    });
  
    const handleChange = (e: any) => {
      setForm({ ...form, [e.target.name]: e.target.value });
    };
  
    const handleSubmit = async () => {
      await axios.post('/api/students', form);
      onAdded();
      onClose();
      setForm({ name: '', email: '', phone: '', codeforcesHandle: '' });
    };
  
    return (
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Add Student</DialogTitle>
        <DialogContent>
          <TextField fullWidth margin="normal" name="name" label="Name" value={form.name} onChange={handleChange} />
          <TextField fullWidth margin="normal" name="email" label="Email" value={form.email} onChange={handleChange} />
          <TextField fullWidth margin="normal" name="phone" label="Phone" value={form.phone} onChange={handleChange} />
          <TextField fullWidth margin="normal" name="codeforcesHandle" label="Codeforces Handle" value={form.codeforcesHandle} onChange={handleChange} />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>Add</Button>
        </DialogActions>
      </Dialog>
    );
  }