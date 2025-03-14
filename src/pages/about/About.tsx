import { motion } from 'framer-motion';
import { Typography, Paper, Grid, Avatar } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  textAlign: 'center',
  height: '100%',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[8],
  },
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: theme.spacing(12),
  height: theme.spacing(12),
  margin: 'auto',
  marginBottom: theme.spacing(2),
}));

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.5,
      staggerChildren: 0.2,
    },
  },
};

const About = () => {
  const team = [
    { name: 'John Doe', role: 'CEO', avatar: '/path/to/avatar1.jpg' },
    { name: 'Jane Smith', role: 'CTO', avatar: '/path/to/avatar2.jpg' },
    { name: 'Mike Johnson', role: 'Designer', avatar: '/path/to/avatar3.jpg' },
  ];

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="initial"
      variants={pageVariants}
    >
      <Typography variant="h4" gutterBottom component="h1">
        About Us
      </Typography>
      <Grid container spacing={3}>
        {team.map((member, index) => (
          <Grid item xs={12} sm={4} key={index}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
            >
              <StyledPaper elevation={3}>
                <StyledAvatar src={member.avatar}>
                  {member.name.charAt(0)}
                </StyledAvatar>
                <Typography variant="h6">{member.name}</Typography>
                <Typography variant="subtitle1" color="textSecondary">
                  {member.role}
                </Typography>
              </StyledPaper>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </motion.div>
  );
};

export default About; 