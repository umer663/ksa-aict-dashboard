import { motion } from 'framer-motion';
import { Typography, Grid, Paper, Box } from '@mui/material';
import { styled } from '@mui/material/styles';

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
      <Grid container spacing={3}>
        {['Total Patients', 'Total Users', "Total Therapist"].map((item, index) => (
          <Grid item xs={12} sm={6} md={3} key={item}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <StyledPaper elevation={3}>
                <Typography variant="h6">{item}</Typography>
                <Typography variant="h4" color="primary">
                  {Math.floor(Math.random() * 1000)}
                </Typography>
              </StyledPaper>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </motion.div>
  );
};

export default Dashboard; 