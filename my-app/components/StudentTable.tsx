'use client';

import {
  DataGrid,
  GridColDef,
  GridToolbarContainer,
  GridToolbarExport,
} from '@mui/x-data-grid';
import {
  Box,
  IconButton,
  Typography,
  Button,
  Tooltip,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useCallback } from 'react';

interface Student {
  _id: string;
  name: string;
  email: string;
  phone: string;
  codeforcesHandle: string;
  currentRating: number;
  maxRating: number;
  lastSynced?: string;
}

interface Props {
  students: Student[];
  onEdit: (student: Student) => void;
  onDelete: () => void;
  onViewProfile: (id: string) => void;
}

function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbarExport csvOptions={{ fileName: 'students_data' }} />
    </GridToolbarContainer>
  );
}

export default function StudentTable({ students, onEdit, onDelete, onViewProfile }: Props) {
  const handleDelete = useCallback(async (id: string) => {
    if (!confirm('Are you sure you want to delete this student?')) return;

    try {
      await fetch(`/api/students/${id}`, { method: 'DELETE' });
      onDelete(); // Refetch the students
    } catch (err) {
      console.error('Failed to delete:', err);
    }
  }, [onDelete]);

  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Name', flex: 1 },
    { field: 'email', headerName: 'Email', flex: 1.3 },
    { field: 'phone', headerName: 'Phone Number', flex: 1 },
    { field: 'codeforcesHandle', headerName: 'CF Handle', flex: 1 },
    { field: 'currentRating', headerName: 'Current Rating', type: 'number', flex: 0.8 },
    { field: 'maxRating', headerName: 'Max Rating', type: 'number', flex: 0.8 },
    {
      field: 'lastSynced',
      headerName: 'Last Synced',
      flex: 1.2,
      renderCell: (params) => {
        return (
          <Typography variant="body2">
            {params.value
              ? new Date(params.value).toLocaleString()
              : 'Never'}
          </Typography>
        );
      },
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      sortable: false,
      renderCell: (params) => (
        <>
          <Tooltip title="View Profile">
            <IconButton onClick={() => onViewProfile(params.row._id)}>
              <VisibilityIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit">
            <IconButton onClick={() => onEdit(params.row)}>
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton onClick={() => handleDelete(params.row._id)}>
              <DeleteIcon color="error" />
            </IconButton>
          </Tooltip>
        </>
      ),
    },
  ];

  const rows = students.map((s) => ({ id: s._id, ...s }));

  return (
    <Box sx={{ width: '100%', height: 600 }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSizeOptions={[10, 20, 50]}
        initialState={{
          pagination: { paginationModel: { pageSize: 10, page: 0 } },
        }}
        disableRowSelectionOnClick
        slots={{ toolbar: CustomToolbar }}
      />
    </Box>
  );
}
