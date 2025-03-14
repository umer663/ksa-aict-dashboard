import { useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { User } from './models/types';

// Components
import LoginForm from './components/LoginForm';
import DashboardLayout from './components/DashboardLayout';

// Pages
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import PatientHistory from './pages/PatientHistory';
import AddPatientHistory from './pages/AddPatientHistory';
import Profile from './pages/Profile';
import TopicsPage from './pages/TopicsPage';

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
            <Route path="/topics" element={<TopicsPage />} />
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