import { Typography, Paper, Container, Box, Grid, Card, CardMedia, CardContent, Divider } from '@mui/material';
import RohaniIlaj from '../../assets/ilaajbook.jpg';
import NazariyaRangONoor from '../../assets/nazariya.jpg';
import ColourTherapy from '../../assets/colourtherapybook.jpg';

const books = [
  {
    title: 'Rang-o-Roshni se Ilaaj',
    year: 1978,
    image: RohaniIlaj, // Replace with actual path
  },
  {
    title: 'Nazariya Rang-o-Noor',
    year: 1995,
    image: NazariyaRangONoor, // Replace with actual path
  },
  {
    title: 'Colour Therapy',
    year: 1998,
    image: ColourTherapy, // Replace with actual path
  },
];

const About = () => (
  <Container maxWidth="md" sx={{ mt: 6, mb: 6 }}>
    <Paper elevation={3} sx={{ p: { xs: 2, sm: 4 }, background: '#fafbfc', maxWidth: 900, mx: 'auto' }}>
      <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ fontWeight: 600 }}>
        About Colour Therapy
      </Typography>
      <Typography variant="body1" paragraph align="left" sx={{ fontSize: '1.15rem', mb: 2, textAlign: 'justify' }}>
        Colour Therapy is a method of treatment that uses the visible spectrum (colors) of electromagnetic radiation to cure diseases. It is a centuries-old concept used successfully to cure various ailments. Colour Therapy was introduced in Pakistan by the spiritual scientist and Imam Silsila Azeemia, Syed Muhammad Azeem Barkhiya, renowned as Huzoor Qalandar Baba Auliya (RA), in 1960.
      </Typography>
      <Typography variant="body1" align="left" sx={{ fontSize: '1.15rem', textAlign: 'justify' }}>
        Subsequently, Khanwada Silsila-e-Azeemia, Khawaja Shamsuddin Azeemi wrote the book <b>Rang-o-Roshni se Ilaaj</b> in 1978, <b>Nazariya Rang-o-Noor</b> in 1995 and <b>Colour Therapy</b> in 1998 which cover various aspects of Colour Therapy in detail.
      </Typography>
        <Divider sx={{ mb: 3, mt:6 }} />
      <Box mt={5}>
        <Typography variant="h5" component="h2" gutterBottom align="center" sx={{ fontWeight: 600 }}>
          Books
        </Typography>
        <Typography variant="body1" align="left" sx={{ fontSize: '1.1rem', textAlign: 'justify', mb: 4 }}>
          Comprehensive books written by Khawaja Shamsuddin Azeemi that have established the foundation of modern Colour Therapy practice
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          {books.map((book, idx) => (
            <Grid item xs={12} sm={6} md={4} key={idx}>
              <Card elevation={3} sx={{ borderRadius: 3, height: 480, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <CardMedia
                  component="img"
                  image={book.image}
                  alt={book.title}
                  sx={{ height: 320, width: '100%', objectFit: 'contain', background: '#fff', p: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                />
                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                  <Typography variant="subtitle1" align="center" sx={{ fontWeight: 700, textTransform: 'capitalize', letterSpacing: 1, mb: 1 }}>
                    {book.title}
                  </Typography>
                  <Typography variant="caption" align="center" color="text.secondary" sx={{ letterSpacing: 1 }}>
                    Published In {book.year}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Paper>
  </Container>
);

export default About;