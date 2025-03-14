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

// Topic data structure
export interface Topic {
  id: number;
  title: string;
  description: string;
  content: string;
  images: string[];
}

// Sample topics data
const topicsData: Topic[] = [
  {
    id: 1,
    title: "Introduction to React",
    description: "Learn the basics of React development",
    content: "React is a JavaScript library for building user interfaces...",
    images: ["/images/react1.jpg", "/images/react2.jpg"]
  },
  {
    id: 2,
    title: "State Management",
    description: "Understanding state in React applications",
    content: "State management is crucial for maintaining data in React apps...",
    images: ["/images/state1.jpg", "/images/state2.jpg"]
  },
  {
    id: 3,
    title: "Component Lifecycle",
    description: "Understanding React component lifecycle",
    content: "React components go through several lifecycle phases...",
    images: ["/images/lifecycle1.jpg", "/images/lifecycle2.jpg"]
  },
  {
    id: 4,
    title: "Hooks in React",
    description: "Modern React development with Hooks",
    content: "Hooks are functions that allow you to use state and lifecycle features...",
    images: ["/images/hooks1.jpg", "/images/hooks2.jpg"]
  },
  {
    id: 5,
    title: "React Router",
    description: "Navigation in React applications",
    content: "React Router enables navigation between different components...",
    images: ["/images/router1.jpg", "/images/router2.jpg"]
  },
  {
    id: 6,
    title: "Context API",
    description: "Global state management with Context",
    content: "The Context API provides a way to pass data through the component tree...",
    images: ["/images/context1.jpg", "/images/context2.jpg"]
  },
  {
    id: 7,
    title: "React Performance",
    description: "Optimizing React applications",
    content: "Performance optimization is crucial for large React applications...",
    images: ["/images/performance1.jpg", "/images/performance2.jpg"]
  },
  {
    id: 8,
    title: "Testing React Apps",
    description: "Testing strategies for React",
    content: "Testing is an essential part of developing reliable React applications...",
    images: ["/images/testing1.jpg", "/images/testing2.jpg"]
  },
  {
    id: 9,
    title: "React Best Practices",
    description: "Best practices and patterns",
    content: "Following best practices ensures maintainable and scalable applications...",
    images: ["/images/practices1.jpg", "/images/practices2.jpg"]
  },
  {
    id: 10,
    title: "Advanced React Patterns",
    description: "Advanced design patterns in React",
    content: "Advanced patterns help in building complex React applications...",
    images: ["/images/patterns1.jpg", "/images/patterns2.jpg"]
  }
];

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