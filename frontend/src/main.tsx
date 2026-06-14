import React from 'react'
import { createRoot } from 'react-dom/client'
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App'
import { BrowserRouter } from 'react-router'
import './index.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    background: { default: '#f5f7fa' },
  },
  typography: {
    fontFamily:
      '"Inter", "Roboto", "Helvetica Neue", Arial, sans-serif',
  },
  shape: { borderRadius: 10 },
  components: {
    MuiCard: {
      defaultProps: { variant: 'outlined' },
    },
    MuiButton: {
      styleOverrides: {
        root: { textTransform: 'none', fontWeight: 600 },
      },
    },
  },
});

createRoot(document.getElementById('root') as HTMLElement).render(
  // <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  // </React.StrictMode>
)
