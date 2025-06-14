// app/components/Footer.tsx
'use client';

import { Box, Container, Typography, Link, useTheme } from '@mui/material';
import React from 'react';

export default function Footer() {
  const theme = useTheme();

  return (
    <Box
      component="footer"
      sx={{
        borderTop: `1px solid ${theme.palette.divider}`,
        backgroundColor: theme.palette.background.paper,
        mt: 8,
        py: 3,
        px: 2,
      }}
    >
      <Container maxWidth="lg" sx={{ textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Created by{' '}
          <Link
            href="https://www.akshayesackimuthu.com"
            target="_blank"
            rel="noopener"
            underline="hover"
          >
            Akshay Esackimuthu
          </Link>
          {' '}| Full Stack Developer Intern Assignment
        </Typography>
      </Container>
    </Box>
  );
}
