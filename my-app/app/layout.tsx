
import './globals.css';
import { ThemeProvider } from '@/contexts/ThemeContext';
import EmotionRegistry from '@/components/EmotionRegistry';
import Footer from '@/components/Footer';
import type { Metadata } from 'next';
import { Box } from '@mui/material';
import { initApp } from '@/utils/init';
import dynamic from 'next/dynamic';
import ClientNavbar from '@/components/ClientNavbar';

initApp();

export const metadata: Metadata = {
  title: 'Student Progress Management',
  description: 'Track and manage Codeforces activity of students.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <EmotionRegistry>
          <ThemeProvider>
          <ClientNavbar /> 
            <Box component="main" flexGrow={1}>
              {children}
            </Box>
            <Footer />
          </ThemeProvider>
        </EmotionRegistry>
      </body>
    </html>
  );
}


