import { useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { AnimatePresence } from 'framer-motion';
import { createTheme as createThemeMui } from '@mui/material/styles';

import LoginForm from './components/LoginForm';
import DashboardLayout from './components/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import PatientHistory from './pages/PatientHistory';
import AddPatientHistory from './pages/AddPatientHistory';
import Profile from './pages/Profile';

interface User {
  email: string;
}

const theme = createThemeMui({
  palette: {
    primary: {
      main: '#1976d2',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarColor: "#6b6b6b #2b2b2b",
          "&::-webkit-scrollbar, & *::-webkit-scrollbar": {
            width: 8,
          },
          "&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb": {
            borderRadius: 8,
            backgroundColor: "#6b6b6b",
            minHeight: 24,
          },
          "&::-webkit-scrollbar-track, & *::-webkit-scrollbar-track": {
            backgroundColor: "#2b2b2b",
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundImage: 'none',
        },
      },
    },
  },
});

function App() {
  const [user, setUser] = useState<User | null>(null);
  const location = useLocation();

  const handleLogin = (email: string) => {
    setUser({ email });
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {user ? (
            <Route
              element={
                <DashboardLayout
                  userEmail={user.email}
                  onLogout={handleLogout}
                />
              }
            >
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/add-patient" element={<AddPatientHistory />} />
              <Route path="/patient-history" element={<PatientHistory />} />
              <Route path="/home" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Route>
          ) : (
            <>
              <Route path="/login" element={<LoginForm onLogin={handleLogin} />} />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </>
          )}
        </Routes>
      </AnimatePresence>
    </ThemeProvider>
  );
}

export default App;
