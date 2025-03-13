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

interface ContactInfoProps {
  contactInfo: {
    contact_number: string;
    email: string;
    address: {
      street: string;
      city: string;
      state: string;
      postal_code: string;
      country: string;
    };
  };
}

const ContactInfoCard = ({ contactInfo }: ContactInfoProps) => {
  return (
    <Card elevation={2}>
      <CardContent>
        <Typography variant="h6" gutterBottom color="primary">
          Contact Information
        </Typography>
        
        <Stack spacing={2}>
          <Box display="flex" alignItems="center" gap={1}>
            <Phone color="action" />
            <Typography variant="body1">
              {contactInfo.contact_number}
            </Typography>
          </Box>

          <Box display="flex" alignItems="center" gap={1}>
            <Email color="action" />
            <Typography variant="body1">
              {contactInfo.email}
            </Typography>
          </Box>

          <Box>
            <Typography variant="subtitle2" color="primary" gutterBottom>
              Address
            </Typography>
            <Stack spacing={1}>
              <Box display="flex" alignItems="center" gap={1}>
                <Home color="action" />
                <Typography variant="body1">
                  {contactInfo.address.street}
                </Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={1}>
                <LocationCity color="action" />
                <Typography variant="body1">
                  {contactInfo.address.city}, {contactInfo.address.state} {contactInfo.address.postal_code}
                </Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={1}>
                <Public color="action" />
                <Typography variant="body1">
                  {contactInfo.address.country}
                </Typography>
              </Box>
            </Stack>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default ContactInfoCard; 