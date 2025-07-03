import React, { createContext, useContext, useEffect, useState } from 'react';
import { fetchAppConfig, fetchNonRemoveableUsers, fetchUserDefaults, AppConfig } from '../services/appConfigService';

interface ExtendedAppConfig extends AppConfig {
  nonRemoveableUsers: string[];
  defaultRole: string;
  defaultPermissions: string[];
}
const AppConfigContext = createContext<ExtendedAppConfig | null>(null);

export const useAppConfig = () => useContext(AppConfigContext);

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

  if (!config) return <div>Loading app config...</div>;

  return (
    <AppConfigContext.Provider value={config}>
      {children}
    </AppConfigContext.Provider>
  );
}; 