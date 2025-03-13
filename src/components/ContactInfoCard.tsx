import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Stack,
} from '@mui/material';
import {
  Phone,
  Email,
  Home,
  LocationCity,
  Public,
} from '@mui/icons-material';
import { ContactInfoCardProps } from '../models/types';

const ContactInfoCard = ({ contactInfo }: ContactInfoCardProps) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Contact Information
        </Typography>
        <Stack spacing={2}>
          <Box display="flex" alignItems="center" gap={1}>
            <Phone color="action" />
            <Typography>{contactInfo.contact_number}</Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={1}>
            <Email color="action" />
            <Typography>{contactInfo.email}</Typography>
          </Box>
          <Box>
            <Box display="flex" alignItems="center" gap={1} mb={1}>
              <Home color="action" />
              <Typography>{contactInfo.address.street}</Typography>
            </Box>
            <Box display="flex" alignItems="center" gap={1} mb={1}>
              <LocationCity color="action" />
              <Typography>
                {contactInfo.address.city}, {contactInfo.address.state} {contactInfo.address.postal_code}
              </Typography>
            </Box>
            <Box display="flex" alignItems="center" gap={1}>
              <Public color="action" />
              <Typography>{contactInfo.address.country}</Typography>
            </Box>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default ContactInfoCard; 