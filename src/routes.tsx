import { useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { User } from './models/types';

// Components
import LoginForm from './components/LoginForm';
import DashboardLayout from './components/DashboardLayout';

// Pages
import Dashboard from './pages/dashboard';
import Home from './pages/home';
import About from './pages/about';
import Contact from './pages/contact';
import PatientHistory from './pages/patients/PatientHistory';
import AddPatientHistory from './pages/patients/AddPatientHistory';
import Profile from './pages/profile';
import Topics from './pages/topics';

const AppRoutes = () => {
  const [user, setUser] = useState<User | null>(null);
  const location = useLocation();

  const handleLogin = (email: string) => {
    setUser({ email });
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
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
            <Route path="/topics" element={<Topics />} />
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
  );
};

export default AppRoutes; 