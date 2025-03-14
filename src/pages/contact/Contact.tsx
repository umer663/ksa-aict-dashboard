import { motion } from 'framer-motion';
import { 
  Typography, 
  Paper, 
  TextField, 
  Button, 
  Grid,
  Box 
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Send as SendIcon } from '@mui/icons-material';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  maxWidth: 600,
  margin: 'auto',
}));

const formVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

const inputVariants = {
  initial: { x: -20, opacity: 0 },
  animate: { x: 0, opacity: 1 },
};

const Contact = () => {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="initial"
      variants={formVariants}
    >
      <Typography variant="h4" gutterBottom component="h1">
        Contact Us
      </Typography>
      <StyledPaper elevation={3}>
        <Box component="form" noValidate>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <motion.div variants={inputVariants} transition={{ delay: 0.1 }}>
                <TextField
                  fullWidth
                  label="First Name"
                  variant="outlined"
                  required
                />
              </motion.div>
            </Grid>
            <Grid item xs={12} sm={6}>
              <motion.div variants={inputVariants} transition={{ delay: 0.2 }}>
                <TextField
                  fullWidth
                  label="Last Name"
                  variant="outlined"
                  required
                />
              </motion.div>
            </Grid>
            <Grid item xs={12}>
              <motion.div variants={inputVariants} transition={{ delay: 0.3 }}>
                <TextField
                  fullWidth
                  label="Email"
                  variant="outlined"
                  required
                  type="email"
                />
              </motion.div>
            </Grid>
            <Grid item xs={12}>
              <motion.div variants={inputVariants} transition={{ delay: 0.4 }}>
                <TextField
                  fullWidth
                  label="Message"
                  variant="outlined"
                  required
                  multiline
                  rows={4}
                />
              </motion.div>
            </Grid>
            <Grid item xs={12}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  size="large"
                  endIcon={<SendIcon />}
                >
                  Send Message
                </Button>
              </motion.div>
            </Grid>
          </Grid>
        </Box>
      </StyledPaper>
    </motion.div>
  );
};

export default Contact; 