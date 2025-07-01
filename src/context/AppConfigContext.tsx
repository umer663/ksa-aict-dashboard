import React, { createContext, useContext, useEffect, useState } from 'react';
import { fetchAppConfig, AppConfig } from '../services/appConfigService';

const AppConfigContext = createContext<AppConfig | null>(null);

export const useAppConfig = () => useContext(AppConfigContext);

export const AppConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<AppConfig | null>(null);

  useEffect(() => {
    fetchAppConfig().then(setConfig).catch(console.error);
  }, []);

  if (!config) return <div>Loading app config...</div>;

  return (
    <AppConfigContext.Provider value={config}>
      {children}
    </AppConfigContext.Provider>
  );
}; 