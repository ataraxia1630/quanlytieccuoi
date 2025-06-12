import React from 'react';
import MainRoutes from './app/routes/MainRoutes';
import { createTheme } from '@mui/material/styles';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { PermissionProvider } from './context/PermissionContext';

const theme = createTheme({
  typography: {
    fontFamily: '"Inconsolata", monospace',
    fontWeightRegular: 400,
    fontSize: 16,

    // Các cấp tiêu đề h1 - h6
    h1: {
      fontFamily: '"Noto Serif", serif',
      fontSize: '1.75rem', // ~28px (1.75 * 16)
      fontWeight: 700,
      margin: 0,
      padding: 0,
      color: '#151515',
    },
    h2: {
      fontFamily: '"Noto Serif", serif',
      fontSize: '1.5rem', // 24px
      fontWeight: 600,
      margin: 0,
      padding: 0,
      color: '#151515',
    },
    h3: {
      fontFamily: '"Noto Serif", serif',
      fontSize: '1.25rem', // 20px
      fontWeight: 500,
      margin: 0,
      padding: 0,
      color: '#151515',
    },
    h4: {
      fontFamily: '"Noto Serif", serif',
      fontWeight: 400,
      margin: 0,
      padding: 0,
      color: '#151515',
    },
    h5: {
      fontFamily: '"Noto Serif", serif',
      fontWeight: 400,
      margin: 0,
      padding: 0,
      color: '#151515',
    },
    h6: {
      fontFamily: '"Noto Serif", serif',
      fontWeight: 400,
      margin: 0,
      padding: 0,
      color: '#151515',
    },

    // cho p (paragraph)
    body1: {
      fontSize: '1rem', // 16px
      marginBottom: '1rem',
      color: '#2d2c2c', // màu chữ giống body
    },
  },
});

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <PermissionProvider>
        <MainRoutes />
      </PermissionProvider>
    </ThemeProvider>
  );
}
