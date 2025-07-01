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
import { db } from '../../services/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { User } from '../../models/types';
import { v4 as uuidv4 } from 'uuid';
import CircularProgress from '@mui/material/CircularProgress';

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

interface BugFeatureProps {
  user: User;
}

const BugFeature = ({ user }: BugFeatureProps) => {
  const [tab, setTab] = useState(0);
  const [form, setForm] = useState<FormState>(initialForm);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.description) {
      setError('All fields are required.');
      setSuccess('');
      return;
    }
    setLoading(true);
    try {
      await addDoc(collection(db, 'bugFeatureReports'), {
        id: uuidv4(),
        ...form,
        type: tab === 0 ? 'bug' : 'feature',
        createdAt: serverTimestamp(),
        createdBy: {
          userId: (user as any).uid || '',
          email: user.email,
          name: user.name || '',
        },
      });
      setSuccess(`${tab === 0 ? 'Bug' : 'Feature'} submitted successfully!`);
      setError('');
      setForm(initialForm);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to submit. Please try again.');
      setSuccess('');
    }
    setLoading(false);
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
            <Button type="submit" variant="contained" sx={{ mt: 2 }} disabled={loading}>
              Submit {tab === 0 ? 'Bug' : 'Feature'}
              {loading && <CircularProgress size={24} sx={{ ml: 2 }} />}
            </Button>
          </form>
        </Box>
      </Paper>
    </Box>
  );
};

export default BugFeature; 