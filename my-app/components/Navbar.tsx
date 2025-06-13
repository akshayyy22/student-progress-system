'use client';

import { AppBar, Toolbar, Typography, IconButton, Box, useTheme } from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { useThemeMode } from '@/contexts/ThemeContext';

export default function Navbar() {
  const theme = useTheme();
  const { toggleColorMode } = useThemeMode();

  return (
    <AppBar position="static">
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h6" component="div">
          Student Progress Manager
        </Typography>
        <Box>
          <IconButton onClick={toggleColorMode} color="inherit">
            {theme.palette.mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
