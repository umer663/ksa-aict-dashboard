import { motion } from 'framer-motion';
import { Typography, Grid, Paper, Box, CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useEffect, useState } from 'react';
import { fetchDashboardStats } from '../../services/statsService';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  height: '100%',
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
  },
}));

const pageVariants = {
  initial: {
    opacity: 0,
    x: -20,
  },
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
    },
  },
  exit: {
    opacity: 0,
    x: 20,
  },
};

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalUsers: 0,
    totalTherapists: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardStats()
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch((err) => {
        setError('Failed to load stats');
        setLoading(false);
      });
  }, []);

  const statItems = [
    { label: 'Total Patients', value: stats.totalPatients },
    { label: 'Total Users', value: stats.totalUsers },
    { label: 'Total Therapist', value: stats.totalTherapists },
  ];

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
    >
      <Typography variant="h4" gutterBottom component="h1">
        Dashboard
      </Typography>
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight={120}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <Grid container spacing={3}>
          {statItems.map((item, index) => (
            <Grid item xs={12} sm={6} md={3} key={item.label}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <StyledPaper elevation={3}>
                  <Typography variant="h6">{item.label}</Typography>
                  <Typography variant="h4" color="primary">
                    {item.value}
                  </Typography>
                </StyledPaper>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      )}
    </motion.div>
  );
};

export default Dashboard; 