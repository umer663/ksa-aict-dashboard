import React, { useState } from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
  Paper,
  Grid,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import TopicModal from './TopicModal';
import { topicsData } from '../data/topicsData';
import { Topic } from '../types';

// Styled components
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  margin: theme.spacing(2),
  borderRadius: theme.spacing(2),
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
}));

const StyledListItem = styled(ListItemButton)(({ theme }) => ({
  borderRadius: theme.spacing(1),
  marginBottom: theme.spacing(1),
  '&:hover': {
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.primary.contrastText,
  },
}));

const Topics = () => {
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleTopicClick = (topic: Topic) => {
    setSelectedTopic(topic);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedTopic(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Box sx={{ maxWidth: 1200, margin: 'auto', p: 2 }}>
        <Typography variant="h4" gutterBottom component="h1" sx={{ mb: 4 }}>
          Topics Index
        </Typography>
        
        <Grid container spacing={3}>
          {topicsData.map((topic) => (
            <Grid item xs={12} sm={6} md={4} key={topic.id}>
              <StyledPaper>
                <List disablePadding>
                  <StyledListItem onClick={() => handleTopicClick(topic)}>
                    <ListItemText
                      primary={topic.title}
                      secondary={topic.description}
                      primaryTypographyProps={{
                        variant: 'h6',
                        gutterBottom: true
                      }}
                      secondaryTypographyProps={{
                        variant: 'body2'
                      }}
                    />
                  </StyledListItem>
                </List>
              </StyledPaper>
            </Grid>
          ))}
        </Grid>

        {selectedTopic && (
          <TopicModal
            open={modalOpen}
            topic={selectedTopic}
            onClose={handleCloseModal}
          />
        )}
      </Box>
    </motion.div>
  );
};

export default Topics; 