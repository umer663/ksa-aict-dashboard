import { Box, Typography, Paper, Grid, Link, Divider } from '@mui/material';
import { WhatsApp, Language, LocationOn, Email } from '@mui/icons-material';
import { motion } from 'framer-motion';

const Contact = () => {
  const contactDetails = {
    email: 'azeemi.colourtherapy@gmail.com',
    address: 'Tariq Gardens, Lahore, Pakistan',
    WhatsApp: '0334-6396370',
    website: 'https://www.azeemicolourtherapy.com/',
    mapSrc: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3400.355255459798!2d74.25203861515101!3d31.41964588136226!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x391901ad5f97644d%3A0x896b98321987f17b!2sTariq%20Garden%2C%20Lahore%2C%20Punjab%2C%20Pakistan!5e0!3m2!1sen!2s!4v1627000000000!5m2!1sen!2s"
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Typography variant="h4" gutterBottom component="h1" sx={{ color: 'primary.main', mb: 3 }}>
        Contact Information
      </Typography>
      <Paper elevation={3} sx={{ p: { xs: 2, md: 4 }, borderRadius: 2 }}>
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography variant="h5" gutterBottom color="secondary" sx={{ mb: 2 }}>
              Get in Touch
            </Typography>
            <Divider sx={{ mb: 3 }} />
            <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 3 }}>
              <LocationOn sx={{ mr: 2, mt: 0.5, color: 'primary.main' }} />
              <Typography variant="body1">{contactDetails.address}</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Email sx={{ mr: 2, color: 'primary.main' }} />
              <Typography variant="body1">{contactDetails.email}</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <WhatsApp sx={{ mr: 2, color: 'primary.main' }} />
              <Link href="https://wa.me/+923346396370" target="_blank" rel="noopener">
                {contactDetails.WhatsApp}
              </Link>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Language sx={{ mr: 2, color: 'primary.main' }} />
              <Link href={contactDetails.website} target="_blank" rel="noopener" sx={{ wordBreak: 'break-all' }}>
                {contactDetails.website}
              </Link>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ height: 350, borderRadius: 2, overflow: 'hidden', border: '1px solid', borderColor: 'divider' }}>
              <iframe
                src={contactDetails.mapSrc}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Azeemia Colour Therapy Location"
              ></iframe>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </motion.div>
  );
};

export default Contact; 