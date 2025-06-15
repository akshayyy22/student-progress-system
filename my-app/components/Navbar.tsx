'use client';

import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  useTheme,
  Tooltip,
  Popover,
  Divider,
} from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import SettingsIcon from '@mui/icons-material/Settings';
import SchoolIcon from '@mui/icons-material/School';
import { useThemeMode } from '@/contexts/ThemeContext';
import CronSettings from '@/components/CronSettings';

export default function Navbar() {
  const theme = useTheme();
  const { toggleColorMode } = useThemeMode();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => setAnchorEl(null);

  const open = Boolean(anchorEl);

  return (
    <AppBar
      position="sticky"
      elevation={0}
      color="transparent"
      sx={{
        backdropFilter: 'blur(12px)',
        backgroundColor:
          theme.palette.mode === 'dark'
            ? 'rgba(28, 28, 30, 0.75)'
            : 'rgba(255, 255, 255, 0.6)',
        borderBottom: `1px solid ${theme.palette.divider}`,
        boxShadow:
          theme.palette.mode === 'dark'
            ? '0 1px 2px rgba(0,0,0,0.4)'
            : '0 1px 2px rgba(0,0,0,0.1)',
      }}
    >
      <Toolbar
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          minHeight: 64,
          px: { xs: 2, sm: 3 },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
  <img
    src="/tle-logo.png"
    alt="The TLE Eliminators"
    style={{
      width: 32,
      height: 32,
      borderRadius: 6,
      objectFit: 'contain',
    }}
  />
  <Typography
    variant="h6"
    sx={{
      fontWeight: 600,
      fontSize: '1.1rem',
      color:
        theme.palette.mode === 'dark' ? '#f0f0f0' : '#2c2c2c',
      fontFamily: `'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`,
      letterSpacing: 0.2,
    }}
  >
    TLE Eliminators
  </Typography>
</Box>


        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Tooltip title={`Switch to ${theme.palette.mode === 'dark' ? 'Light' : 'Dark'} Mode`}>
            <IconButton
              onClick={toggleColorMode}
              sx={{
                color: theme.palette.text.primary,
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  backgroundColor:
                    theme.palette.mode === 'dark'
                      ? 'rgba(255,255,255,0.08)'
                      : 'rgba(0,0,0,0.04)',
                },
              }}
            >
              {theme.palette.mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
            </IconButton>
          </Tooltip>

          <Tooltip title="Cron Job Settings">
            <IconButton
              onClick={handleOpen}
              sx={{
                color: theme.palette.text.primary,
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  backgroundColor:
                    theme.palette.mode === 'dark'
                      ? 'rgba(255,255,255,0.08)'
                      : 'rgba(0,0,0,0.04)',
                },
              }}
            >
              <SettingsIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Toolbar>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            mt: 1,
            p: 2,
            minWidth: 280,
            borderRadius: 3,
            backgroundColor: theme.palette.background.paper,
            boxShadow:
              theme.palette.mode === 'dark'
                ? '0px 4px 16px rgba(0,0,0,0.5)'
                : '0px 4px 12px rgba(0,0,0,0.1)',
          },
        }}
      >
        <Typography
          variant="subtitle1"
          fontWeight={600}
          sx={{
            mb: 1,
            fontSize: '0.95rem',
            color: theme.palette.text.primary,
          }}
        >
          Cron Settings
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <CronSettings />
      </Popover>
    </AppBar>
  );
}
