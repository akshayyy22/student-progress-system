
'use client';

import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  useTheme,
  Stack,
  CircularProgress,
} from '@mui/material';
import { LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

export default function CronSettings() {
  const theme = useTheme();
  const [time, setTime] = useState<Date | null>(null);
  const [savedTime, setSavedTime] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/settings/cron-time')
      .then((res) => res.json())
      .then((data) => {
        if (data.time) {
          const [min, hour] = data.time.split(' ');
          const date = new Date();
          date.setHours(parseInt(hour), parseInt(min));
          setTime(date);
          setSavedTime(data.time);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    if (!time) return;
    setSaving(true);

    const hour = time.getHours();
    const minute = time.getMinutes();
    const cronTime = `${minute} ${hour} * * *`;

    const res = await fetch('/api/settings/cron-time', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ time: cronTime }),
    });

    if (res.ok) {
      setSavedTime(cronTime);
      await fetch('/api/cron/restart', { method: 'POST' });
    }

    setSaving(false);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box
        sx={{
          maxWidth: 320,
          width: '100%',
          px: 1,
          fontFamily: `'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`,
        }}
      >
        <Typography
          variant="subtitle1"
          fontWeight={600}
          sx={{ fontSize: '0.95rem', mb: 1 }}
        >
          Codeforces Sync Time
        </Typography>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
            <CircularProgress size={22} />
          </Box>
        ) : (
          <Stack spacing={2}>
            <TimePicker
              label="Select Time"
              value={time}
              onChange={(newTime) => setTime(newTime)}
              slotProps={{
                textField: {
                  variant: 'outlined',
                  size: 'small',
                  fullWidth: true,
                  sx: {
                    backgroundColor:
                      theme.palette.mode === 'dark' ? '#2c2c2e' : '#f9f9f9',
                    borderRadius: 2,
                    input: { fontSize: '0.9rem' },
                  },
                },
              }}
            />

            <Button
              variant="contained"
              onClick={handleSave}
              disabled={saving}
              fullWidth
              sx={{
                textTransform: 'none',
                borderRadius: 2,
                fontSize: '0.85rem',
                fontWeight: 500,
                backgroundColor:
                  theme.palette.mode === 'dark'
                    ? theme.palette.primary.dark
                    : theme.palette.primary.main,
                '&:hover': {
                  backgroundColor:
                    theme.palette.mode === 'dark'
                      ? theme.palette.primary.light
                      : theme.palette.primary.dark,
                },
              }}
            >
              {saving ? 'Saving...' : 'Save'}
            </Button>
          </Stack>
        )}

        <Typography
          variant="body2"
          sx={{
            fontSize: '0.8rem',
            color: theme.palette.text.secondary,
            mt: 2,
            wordBreak: 'break-word',
          }}
        >
          Current cron: <b>{savedTime}</b>
        </Typography>
      </Box>
    </LocalizationProvider>
  );
}
