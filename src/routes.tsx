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
  const pages = appConfig?.pages || [];
  const nonRemoveableUsers = appConfig?.nonRemoveableUsers || [];
  const getUserPermissions = (user: User) => {
    if (nonRemoveableUsers.includes(user.email)) {
      return pages.map((p) => p.key);
    }
    if (user.permissions && typeof user.permissions === 'object') {
      return pages.filter(page => user.permissions?.[page.key]?.view === true).map(page => page.key);
    }
    return [];
  };

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
            {(nonRemoveableUsers.includes(user.email) || user.permissions?.['dashboard' as string]?.view === true) && <Route path="/dashboard" element={<Dashboard />} />}
            {(nonRemoveableUsers.includes(user.email) || user.permissions?.['add-patient' as string]?.view === true) && <Route path="/add-patient" element={<AddPatientHistory />} />}
            {(nonRemoveableUsers.includes(user.email) || user.permissions?.['patient-history' as string]?.view === true) && <Route path="/patient-history" element={<PatientHistory />} />}
            {(nonRemoveableUsers.includes(user.email) || user.permissions?.['about' as string]?.view === true) && <Route path="/about" element={<About />} />}
            {(nonRemoveableUsers.includes(user.email) || user.permissions?.['contact' as string]?.view === true) && <Route path="/contact" element={<Contact />} />}
            {(nonRemoveableUsers.includes(user.email) || user.permissions?.['profile' as string]?.view === true) && <Route path="/profile" element={<Profile />} />}
            {(nonRemoveableUsers.includes(user.email) || user.permissions?.['user-management' as string]?.view === true) && (
              <Route path="/user-management" element={<UserManagement currentUser={user} />} />
            )}
            {(nonRemoveableUsers.includes(user.email) || user.permissions?.['bug-feature' as string]?.view === true) && <Route path="/bug-feature" element={<BugFeature user={user} />} />}
            {(nonRemoveableUsers.includes(user.email) || user.permissions?.['tutorials' as string]?.view === true) && <Route path="/tutorials" element={<Tutorials />} />}
            <Route path="*" element={<Navigate to={`/${(nonRemoveableUsers.includes(user.email) ? pages[0]?.key : Object.keys(user.permissions || {}).find(key => user.permissions?.[key as string]?.view))}`} replace />} />
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