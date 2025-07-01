import { useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { User } from './models/types';
import { useAppConfig } from './context/AppConfigContext';

// Components
import LoginForm from './components/LoginForm';
import DashboardLayout from './components/DashboardLayout';

// Pages
import Dashboard from './pages/dashboard';
import About from './pages/about';
import Contact from './pages/contact';
import PatientHistory from './pages/patients/PatientHistory';
import AddPatientHistory from './pages/patients/AddPatientHistory';
import Profile from './pages/profile';
import Topics from './pages/topics';
import Introduction from './pages/introduction';
import UserManagement from './pages/user-management';
import BugFeature from './pages/bug-feature';
import Tutorials from './pages/tutorials';
import Register from './pages/register/Register';

const AppRoutes = () => {
  const [user, setUser] = useState<User | null>(null);
  const location = useLocation();
  const appConfig = useAppConfig();
  const rolePermissions = appConfig?.rolePermissions || {};
  const getUserPermissions = (user: User) => user.permissions || rolePermissions[user.role];

  const handleLogin = (user: User) => {
    setUser(user);
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
                user={user}
                onLogout={handleLogout}
              />
            }
          >
            {getUserPermissions(user).includes('dashboard') && <Route path="/dashboard" element={<Dashboard />} />}
            {/* {getUserPermissions(user).includes('topics') && <Route path="/topics" element={<Topics />} />} */}
            {getUserPermissions(user).includes('add-patient') && <Route path="/add-patient" element={<AddPatientHistory />} />}
            {getUserPermissions(user).includes('patient-history') && <Route path="/patient-history" element={<PatientHistory />} />}
            {getUserPermissions(user).includes('about') && <Route path="/about" element={<About />} />}
            {getUserPermissions(user).includes('contact') && <Route path="/contact" element={<Contact />} />}
            {getUserPermissions(user).includes('profile') && <Route path="/profile" element={<Profile />} />}
            {getUserPermissions(user).includes('user-management') && user.role === 'SuperAdmin' && (
              <Route path="/user-management" element={<UserManagement currentUserEmail={user.email} />} />
            )}
            {getUserPermissions(user).includes('bug-feature') && <Route path="/bug-feature" element={<BugFeature user={user} />} />}
            {getUserPermissions(user).includes('tutorials') && <Route path="/tutorials" element={<Tutorials />} />}
            <Route path="*" element={<Navigate to={`/${getUserPermissions(user)[0]}`} replace />} />
          </Route>
        ) : (
          <>
            <Route path="/login" element={<LoginForm onLogin={handleLogin} />} />
            <Route path="/register" element={<Register />} />
            <Route path="/introduction" element={<Introduction />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </>
        )}
      </Routes>
    </AnimatePresence>
  );
};

export default AppRoutes;