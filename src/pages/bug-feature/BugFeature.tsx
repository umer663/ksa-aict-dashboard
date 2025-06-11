import { useState } from 'react';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Paper,
  TextField,
  Button,
  Alert,
  Avatar,
} from '@mui/material';
import BugReportIcon from '@mui/icons-material/BugReport';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import PhotoCamera from '@mui/icons-material/PhotoCamera';

interface FormState {
  title: string;
  description: string;
  attachment?: string;
}

const initialForm: FormState = {
  title: '',
  description: '',
  attachment: '',
};

const BugFeature = () => {
  const [tab, setTab] = useState(0);
  const [form, setForm] = useState<FormState>(initialForm);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleTabChange = (_: any, newValue: number) => {
    setTab(newValue);
    setForm(initialForm);
    setSuccess('');
    setError('');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setError('Attachment must be less than 2MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm((prev) => ({ ...prev, attachment: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.description) {
      setError('All fields are required.');
      setSuccess('');
      return;
    }
    setSuccess(`${tab === 0 ? 'Bug' : 'Feature'} submitted successfully!`);
    setError('');
    setForm(initialForm);
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Typography variant="h4" gutterBottom>Bug / Feature</Typography>
      <Paper sx={{ p: 3, mb: 4 }}>
        <Tabs value={tab} onChange={handleTabChange} centered>
          <Tab icon={<BugReportIcon />} label="Bug" />
          <Tab icon={<LightbulbIcon />} label="Feature Request" />
        </Tabs>
        <Box sx={{ mt: 3 }}>
          {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <form onSubmit={handleSubmit}>
            <TextField
              label="Title"
              name="title"
              value={form.title}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Description"
              name="description"
              value={form.description}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
              multiline
              rows={4}
            />
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar
                src={form.attachment}
                sx={{ width: 56, height: 56, mr: 2 }}
                variant="rounded"
              />
              <label htmlFor="attachment-upload">
                <input
                  accept="image/*"
                  id="attachment-upload"
                  type="file"
                  style={{ display: 'none' }}
                  onChange={handleImageChange}
                />
                <Button
                  variant="outlined"
                  component="span"
                  startIcon={<PhotoCamera />}
                >
                  Upload Attachment
                </Button>
              </label>
            </Box>
            <Button type="submit" variant="contained" sx={{ mt: 2 }}>
              Submit {tab === 0 ? 'Bug' : 'Feature'}
            </Button>
          </form>
        </Box>
      </Paper>
    </Box>
  );
};

export default BugFeature; 