import { ThemeProvider as MuiThemeProvider, CssBaseline } from '@mui/material';
import { ReactNode } from 'react';
import theme from './index';

interface ThemeProviderProps {
  children: ReactNode;
}

const ThemeProvider = ({ children }: ThemeProviderProps) => {
  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
};

export default ThemeProvider; 