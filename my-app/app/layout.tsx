import './globals.css';
import { ThemeProvider } from '@/contexts/ThemeContext';

import Navbar from '@/components/Navbar';
import type { Metadata } from 'next';
import { initApp } from '@/utils/init';
initApp();
import { Box } from '@mui/material';

import Footer from '@/components/Footer';
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
      {/* <body>
        
      <ThemeProvider>
          <Navbar />
          {children}
        </ThemeProvider>
        <Footer/>
      </body> */}

<body>
  <ThemeProvider>
    <Box display="flex" flexDirection="column" minHeight="100vh">
      <Navbar />
      <Box component="main" flexGrow={1}>
        {children}
      </Box>
      <Footer />
    </Box>
  </ThemeProvider>
</body>
    </html>
  );
}

