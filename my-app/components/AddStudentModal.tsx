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
      if (!form.codeforcesHandle) return;
    
      try {
        const res = await axios.get(`https://codeforces.com/api/user.info?handles=${form.codeforcesHandle}`);
        const cfUser = res.data.result[0];
    
        const newStudent = {
          name: cfUser.firstName + ' ' + cfUser.lastName || cfUser.handle,
          email: form.email || '',
          phone: form.phone || '',
          codeforcesHandle: cfUser.handle,
          currentRating: cfUser.rating || 0,
          maxRating: cfUser.maxRating || 0,
        };
    
        await axios.post('/api/students', newStudent);
        onAdded();
        onClose();
      } catch (err) {
        alert("Invalid Codeforces Handle");
        console.error(err);
      }
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