import ThemeProvider from './theme/ThemeProvider';
import AppRoutes from './routes';

const App = () => {
  return (
    <ThemeProvider>
      <AppRoutes />
    </ThemeProvider>
  );
};

export default App;
