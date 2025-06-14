
// 'use client';

// import * as React from 'react';
// import {
//   DataGridPremium,
//   GridColDef,
// } from '@mui/x-data-grid-premium';
// import {
//   Box,
//   IconButton,
//   Typography,
//   Tooltip,
//   Switch,
//   useTheme,
//   Snackbar,
//   Alert,
//   Slide,
//   SlideProps,
//   CircularProgress,
// } from '@mui/material';
// import DeleteIcon from '@mui/icons-material/Delete';
// import EditIcon from '@mui/icons-material/Edit';
// import VisibilityIcon from '@mui/icons-material/Visibility';
// import axios from 'axios';
// import  { useEffect, useRef } from 'react';

// import { Student } from '@/app/types/Student';



// interface Props {
//   students: Student[];
//   onEdit: (student: Student) => void;
//   onDelete: () => void;
//   onViewProfile: (id: string) => void;
// }

// function SlideTransition(props: SlideProps) {
//   return <Slide {...props} direction="up" />;
// }

// export default function StudentTable({ students, onEdit, onDelete, onViewProfile }: Props) {
//   const theme = useTheme();
//   const [inProgress, setInProgress] = React.useState(false);

//   const lastSyncedRef = useRef<string | null>(null);

//   useEffect(() => {
//     const interval = setInterval(async () => {
//       try {
//         const res = await fetch('/api/students/lastSynced');
//         if (!res.ok) throw new Error('Failed to fetch');
//         const data = await res.json();

//         if (data.lastSynced && data.lastSynced !== lastSyncedRef.current) {
//           lastSyncedRef.current = data.lastSynced;
//           // Reload page to get fresh data when backend sync happens
//           window.location.reload();
//         }
//       } catch (e) {
//         console.error('Error polling lastSynced:', e);
//       }
//     }, 60 * 1000); // poll every 1 minute, adjust as needed

//     return () => clearInterval(interval);
//   }, []);

//   const handleDelete = async (id: string) => {
//     if (!confirm('Are you sure you want to delete this student?')) return;
//     try {
//       await fetch(`/api/students/${id}`, { method: 'DELETE' });
//       onDelete();
//     } catch (err) {
//       console.error('Failed to delete student:', err);
//     }
//   };

//   const toggleReminder = async (id: string) => {
//     try {
//       await axios.put(`/api/students/${id}/toggle-email`);
//       onDelete(); // Refresh table
//     } catch (err) {
//       console.error('Failed to toggle auto email:', err);
//     }
//   };

//   const columns: GridColDef[] = [
//     { field: 'name', headerName: 'Name', minWidth: 200, flex: 1.1 },
//     { field: 'email', headerName: 'Email', minWidth: 250, flex: 1.3 },
//     { field: 'phone', headerName: 'Phone Number', minWidth: 160, flex: 1.2 },
//     { field: 'codeforcesHandle', headerName: 'CF Handle', minWidth: 140, flex: 1 },
//     {
//       field: 'currentRating',
//       headerName: 'Current Rating',
//       type: 'number',
//       minWidth: 140,
//       flex: 0.8,
//     },
//     {
//       field: 'maxRating',
//       headerName: 'Max Rating',
//       type: 'number',
//       minWidth: 100,
//       flex: 0.8,
//     },
//     {
//       field: 'lastSynced',
//       headerName: 'Last Synced',
//       minWidth: 180,
//       flex: 1.3,
//       renderCell: (params) => (
//         <Typography variant="body2">
//           {params.value ? new Date(params.value).toLocaleString() : 'Never'}
//         </Typography>
//       ),
//     },
//     {
//       field: 'remindersSent',
//       headerName: 'Reminders Sent',
//       type: 'number',
//       minWidth: 160,
//       flex: 0.7,
//     },
//     {
//       field: 'autoReminder',
//       headerName: 'Auto Email',
//       minWidth: 140,
//       flex: 0.9,
//       renderCell: (params) => (
//         <Switch
//           checked={params.value ?? true}
//           onChange={() => toggleReminder(params.row._id)}
//           sx={{ ml: 1 }}
//         />
//       ),
//     },
//     {
//       field: 'actions',
//       headerName: 'Actions',
//       minWidth: 140,
//       flex: 1.2,
//       sortable: false,
//       renderCell: (params) => (
//         <Box sx={{ display: 'flex', gap: 1 }}>
//           <Tooltip title="View Profile">
//             <IconButton onClick={() => onViewProfile(params.row._id)}>
//               <VisibilityIcon fontSize="small" />
//             </IconButton>
//           </Tooltip>
//           <Tooltip title="Edit">
//             <IconButton onClick={() => onEdit(params.row)}>
//               <EditIcon fontSize="small" />
//             </IconButton>
//           </Tooltip>
//           <Tooltip title="Delete">
//             <IconButton onClick={() => handleDelete(params.row._id)}>
//               <DeleteIcon color="error" fontSize="small" />
//             </IconButton>
//           </Tooltip>
//         </Box>
//       ),
//     },
//   ];

//   const rows = students.map((s) => ({ id: s._id, ...s }));

//   return (
//     <>
//       <Snackbar open={inProgress} TransitionComponent={SlideTransition}>
//         <Alert severity="info" icon={<CircularProgress size={24} />}>
//           Exporting Excel file...
//         </Alert>
//       </Snackbar>

//       <Box
//         sx={{
//           height: 'calc(100vh - 220px)',
//           width: '100%',
//           overflowX: 'auto',
//           borderRadius: 2,
//           backgroundColor: theme.palette.background.paper,
//           p: 1,
//         }}
//       >
//         <DataGridPremium
//           rows={rows}
//           columns={columns}
//           checkboxSelection
//           disableRowSelectionOnClick
//           pageSizeOptions={[10, 20, 50]}
//           initialState={{
//             pagination: { paginationModel: { page: 0, pageSize: 10 } },
//           }}
//           showToolbar
//           onExcelExportStateChange={(newState) =>
//             setInProgress(newState === 'pending')
//           }
//           slotProps={{
//             toolbar: {
//               excelOptions: {
//                 worker: () =>
//                   new Worker(new URL('./excelExportWorker.ts', import.meta.url)),
//               },
//             },
//           }}
//           sx={{
//             border: 0,
//             fontSize: 14,
//             '& .MuiDataGrid-columnHeaders': {
//               backgroundColor: theme.palette.mode === 'dark' ? '#2c2c2e' : '#eaeaea',
//               fontWeight: 600,
//               fontSize: '0.95rem',
//               letterSpacing: 0.4,
//             },
//             '& .MuiDataGrid-row:hover': {
//               backgroundColor: theme.palette.mode === 'dark' ? '#2a2a2a' : '#f4f4f4',
//             },
//           }}
//         />
//       </Box>
//     </>
//   );
// }



'use client';

import * as React from 'react';
import {
  DataGrid,
  useGridApiRef,
  gridFilteredSortedRowIdsSelector,
  gridVisibleColumnFieldsSelector,
  GridColDef,
  GridToolbarContainer,
} from '@mui/x-data-grid';
import {
  Box,
  IconButton,
  Typography,
  Tooltip,
  Switch,
  useTheme,
  Snackbar,
  Alert,
  Slide,
  SlideProps,
  CircularProgress,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  FileDownload as FileDownloadIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material';
import axios from 'axios';
import { useEffect, useRef, useState } from 'react';

import { Student } from '@/app/types/Student';

interface Props {
  students: Student[];
  onEdit: (student: Student) => void;
  onDelete: () => void;
  onViewProfile: (id: string) => void;
}

function SlideTransition(props: SlideProps) {
  return <Slide {...props} direction="up" />;
}

function ExportMenuButton({ apiRef }: { apiRef: any }) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleJsonExport = () => {
    const ids = gridFilteredSortedRowIdsSelector(apiRef.current.state);
    const fields = gridVisibleColumnFieldsSelector(apiRef.current.state);

    const data = ids.map((id) => {
      const row: Record<string, any> = {};
      fields.forEach((field) => {
        row[field] = apiRef.current.getCellParams(id, field).value;
      });
      return row;
    });

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'students.json';
    a.click();
    URL.revokeObjectURL(url);

    setAnchorEl(null);
  };

  const handleCsvExport = () => {
    apiRef.current.exportDataAsCsv();
    setAnchorEl(null);
  };

  return (
    <>
      <Tooltip title="Export">
        <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
          <FileDownloadIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Menu open={open} anchorEl={anchorEl} onClose={() => setAnchorEl(null)}>
        <MenuItem onClick={handleCsvExport}>Download as CSV</MenuItem>
        <MenuItem onClick={handleJsonExport}>Download as JSON</MenuItem>
      </Menu>
    </>
  );
}

function CustomToolbar({ apiRef }: { apiRef: any }) {
  return (
    <GridToolbarContainer sx={{ justifyContent: 'flex-end', pr: 1 }}>
      <ExportMenuButton apiRef={apiRef} />
    </GridToolbarContainer>
  );
}

export default function StudentTable({ students, onEdit, onDelete, onViewProfile }: Props) {
  const theme = useTheme();
  const [inProgress, setInProgress] = useState(false);
  const apiRef = useGridApiRef();
  const lastSyncedRef = useRef<string | null>(null);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch('/api/students/lastSynced');
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();

        if (data.lastSynced && data.lastSynced !== lastSyncedRef.current) {
          lastSyncedRef.current = data.lastSynced;
          window.location.reload();
        }
      } catch (e) {
        console.error('Polling error:', e);
      }
    }, 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this student?')) return;
    try {
      await fetch(`/api/students/${id}`, { method: 'DELETE' });
      onDelete();
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const toggleReminder = async (id: string) => {
    try {
      await axios.put(`/api/students/${id}/toggle-email`);
      onDelete();
    } catch (err) {
      console.error('Toggle auto-email failed:', err);
    }
  };

  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Name', minWidth: 200, flex: 1.1 },
    { field: 'email', headerName: 'Email', minWidth: 250, flex: 1.3 },
    { field: 'phone', headerName: 'Phone Number', minWidth: 160, flex: 1.2 },
    { field: 'codeforcesHandle', headerName: 'CF Handle', minWidth: 140, flex: 1 },
    {
      field: 'currentRating',
      headerName: 'Current Rating',
      type: 'number',
      minWidth: 140,
      flex: 0.8,
    },
    {
      field: 'maxRating',
      headerName: 'Max Rating',
      type: 'number',
      minWidth: 100,
      flex: 0.8,
    },
    {
      field: 'lastSynced',
      headerName: 'Last Synced',
      minWidth: 180,
      flex: 1.3,
      renderCell: (params) => (
        <Typography variant="body2">
          {params.value ? new Date(params.value).toLocaleString() : 'Never'}
        </Typography>
      ),
    },
    {
      field: 'remindersSent',
      headerName: 'Reminders Sent',
      type: 'number',
      minWidth: 160,
      flex: 0.7,
    },
    {
      field: 'autoReminder',
      headerName: 'Auto Email',
      minWidth: 140,
      flex: 0.9,
      renderCell: (params) => (
        <Switch
          checked={params.value ?? true}
          onChange={() => toggleReminder(params.row._id)}
          sx={{ ml: 1 }}
        />
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      minWidth: 140,
      flex: 1.2,
      sortable: false,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="View Profile">
            <IconButton onClick={() => onViewProfile(params.row._id)}>
              <VisibilityIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit">
            <IconButton onClick={() => onEdit(params.row)}>
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton onClick={() => handleDelete(params.row._id)}>
              <DeleteIcon color="error" fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  const rows = students.map((s) => ({ id: s._id, ...s }));

  return (
    <>
      <Snackbar open={inProgress} TransitionComponent={SlideTransition}>
        <Alert severity="info" icon={<CircularProgress size={24} />}>
          Exporting Excel file...
        </Alert>
      </Snackbar>

      <Box
        sx={{
          height: 'calc(100vh - 220px)',
          width: '100%',
          overflowX: 'auto',
          borderRadius: 2,
          backgroundColor: theme.palette.background.paper,
          p: 1,
        }}
      >
        <DataGrid
          apiRef={apiRef}
          rows={rows}
          columns={columns}
          checkboxSelection
          disableRowSelectionOnClick
          pageSizeOptions={[10, 20, 50]}
          initialState={{
            pagination: { paginationModel: { page: 0, pageSize: 10 } },
          }}
          slots={{
            toolbar: () => <CustomToolbar apiRef={apiRef} />,
          }}
          showToolbar
          onExcelExportStateChange={(newState) =>
            setInProgress(newState === 'pending')
          }
          sx={{
            border: 0,
            fontSize: 14,
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: theme.palette.mode === 'dark' ? '#2c2c2e' : '#eaeaea',
              fontWeight: 600,
              fontSize: '0.95rem',
              letterSpacing: 0.4,
            },
            '& .MuiDataGrid-row:hover': {
              backgroundColor: theme.palette.mode === 'dark' ? '#2a2a2a' : '#f4f4f4',
            },
          }}
        />
      </Box>
    </>
  );
}
