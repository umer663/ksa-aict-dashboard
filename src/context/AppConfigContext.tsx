import React, { createContext, useContext, useEffect, useState } from 'react';
import { Box, keyframes } from '@mui/material';
import { fetchAppConfig, fetchNonRemoveableUsers, fetchUserDefaults, AppConfig } from '../services/appConfigService';
import logo from '../assets/logo.png';

interface ExtendedAppConfig extends AppConfig {
  nonRemoveableUsers: string[];
  defaultRole: string;
  defaultPermissions: string[];
}
const AppConfigContext = createContext<ExtendedAppConfig | null>(null);

export const useAppConfig = () => useContext(AppConfigContext);

// Animation keyframes
const pulse = keyframes`
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.05);
    opacity: 0.8;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
`;

const rotate = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

export const AppConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<ExtendedAppConfig | null>(null);

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const [appConfig, nonRemoveableUsers, userDefaults] = await Promise.all([
          fetchAppConfig(),
          fetchNonRemoveableUsers(),
          fetchUserDefaults(),
        ]);
        setConfig({ ...appConfig, nonRemoveableUsers, ...userDefaults });
      } catch (err) {
        console.error(err);
      }
    };
    loadConfig();
  }, []);

  if (!config) {
    return (
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'background.default',
          zIndex: 9999,
        }}
      >
        <Box
          sx={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Outer rotating ring */}
          <Box
            sx={{
              position: 'absolute',
              width: 120,
              height: 120,
              border: '3px solid',
              borderColor: 'primary.main',
              borderTopColor: 'transparent',
              borderRadius: '50%',
              animation: `${rotate} 2s linear infinite`,
            }}
          />
          {/* Logo with pulse animation */}
          <Box
            component="img"
            src={logo}
            alt="KSA Institute of Colour Therapy Logo"
            sx={{
              width: 80,
              height: 80,
              animation: `${pulse} 2s ease-in-out infinite`,
              zIndex: 1,
            }}
          />
        </Box>
      </Box>
    );
  }

  return (
    <AppConfigContext.Provider value={config}>
      {children}
    </AppConfigContext.Provider>
  );
}; 