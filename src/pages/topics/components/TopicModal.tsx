import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton,
  ImageList,
  ImageListItem,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { Topic } from '../types';

interface TopicModalProps {
  open: boolean;
  topic: Topic;
  onClose: () => void;
}

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    maxWidth: '800px',
    width: '100%',
    borderRadius: theme.spacing(2),
  },
}));

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: theme.spacing(2, 3),
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
}));

const ContentSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  '& p': {
    marginBottom: theme.spacing(2),
  },
}));

const TopicModal: React.FC<TopicModalProps> = ({ open, topic, onClose }) => {
  return (
    <StyledDialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      scroll="paper"
    >
      <StyledDialogTitle>
        <Typography variant="h6">{topic.title}</Typography>
        <IconButton
          edge="end"
          color="inherit"
          onClick={onClose}
          aria-label="close"
        >
          <CloseIcon />
        </IconButton>
      </StyledDialogTitle>

      <DialogContent dividers>
        <ContentSection>
          <Typography variant="subtitle1" color="primary" gutterBottom>
            Description
          </Typography>
          <Typography variant="body1" paragraph>
            {topic.description}
          </Typography>

          <Typography variant="subtitle1" color="primary" gutterBottom>
            Content
          </Typography>
          <Typography variant="body1" paragraph>
            {topic.content}
          </Typography>

          {topic.images.length > 0 && (
            <>
              <Typography variant="subtitle1" color="primary" gutterBottom>
                Images
              </Typography>
              <ImageList cols={2} gap={16}>
                {topic.images.map((image, index) => (
                  <ImageListItem key={index}>
                    <img
                      src={image}
                      alt={`${topic.title} illustration ${index + 1}`}
                      loading="lazy"
                      style={{ borderRadius: 8 }}
                    />
                  </ImageListItem>
                ))}
              </ImageList>
            </>
          )}
        </ContentSection>
      </DialogContent>

      <DialogActions sx={{ padding: 2 }}>
        <Button onClick={onClose} variant="contained" color="primary">
          Close
        </Button>
      </DialogActions>
    </StyledDialog>
  );
};

export default TopicModal; 