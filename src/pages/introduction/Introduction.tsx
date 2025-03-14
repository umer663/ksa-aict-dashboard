import React from 'react';
import { Box, Typography, Button, Container, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Introduction = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Container maxWidth="lg">
        <Box sx={{ py: 6 }}>
          <Paper 
            elevation={3}
            sx={{ 
              p: 4, 
              borderRadius: 2,
              bgcolor: 'background.paper',
            }}
          >
            <Typography 
              variant="h3" 
              component="h1" 
              gutterBottom
              sx={{ 
                color: 'primary.main',
                textAlign: 'center',
                mb: 4,
                fontWeight: 600,
              }}
            >
              Khuwaja Shamsu Deen Azeemi
            </Typography>

            <Typography variant="body1" paragraph>
              Khuwaja Shamsu Deen Azeemi was a renowned spiritual leader and pioneer in the field of color therapy.
              His groundbreaking work in chromotherapy has helped countless individuals achieve physical, mental,
              and spiritual well-being through the therapeutic application of colors.
            </Typography>

            <Typography variant="body1" paragraph>
              Born in the early 20th century, Khuwaja Shamsu Deen Azeemi dedicated his life to understanding
              the profound impact of colors on human consciousness and health. He developed a comprehensive
              system of color therapy that combines ancient wisdom with modern scientific principles.
            </Typography>

            <Typography variant="body1" paragraph>
              The Azeemi Color Therapy System is based on the principle that every color carries specific
              electromagnetic wavelengths and vibrations that can influence our body's cells and energy centers.
              This system has been successfully used to treat various physical and psychological conditions,
              promoting natural healing and balance.
            </Typography>

            <Typography variant="body1" paragraph>
              His legacy continues through the systematic application of color therapy techniques, which have
              been documented and practiced worldwide. The system includes specific color meditation practices,
              color-based healing methods, and the strategic use of colored lights and materials for therapeutic
              purposes.
            </Typography>

            <Typography variant="body1" paragraph>
              Today, the Azeemi Color Therapy System represents one of the most comprehensive and practical
              approaches to color therapy, offering hope and healing to those seeking natural and holistic
              methods of treatment.
            </Typography>

            <Box sx={{ mt: 6, textAlign: 'center' }}>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/login')}
                sx={{
                  px: 4,
                  py: 1.5,
                  borderRadius: 1,
                }}
              >
                Back to Login
              </Button>
            </Box>
          </Paper>
        </Box>
      </Container>
    </motion.div>
  );
};

export default Introduction; 