import { useEffect, useState } from 'react';
import { Typography, Paper, Container, Box, Grid, Card, CardMedia, CardContent, Divider, CircularProgress, Alert } from '@mui/material';
import { motion } from 'framer-motion';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { db } from '../../services/firebase';

interface Book {
  title: string;
  year: number;
  image: string;
}

interface AboutContent {
  title: string;
  introParagraphs: string[];
  booksSectionTitle: string;
  booksSectionDescription: string;
}

const containerVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      when: 'beforeChildren',
      staggerChildren: 0.18,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const About = () => {
  const [aboutContent, setAboutContent] = useState<AboutContent | null>(null);
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAboutData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch main about content
        const aboutDocRef = doc(db, 'about-page', 'main');
        const aboutDocSnap = await getDoc(aboutDocRef);
        if (!aboutDocSnap.exists()) {
          setError('About page content not found.');
          setLoading(false);
          return;
        }
        setAboutContent(aboutDocSnap.data() as AboutContent);

        // Fetch books subcollection
        const booksColRef = collection(db, 'about-page', 'main', 'books');
        const booksSnap = await getDocs(booksColRef);
        const booksList: Book[] = booksSnap.docs.map(doc => doc.data() as Book);
        setBooks(booksList);
      } catch (err) {
        setError('Failed to load About page content.');
      } finally {
        setLoading(false);
      }
    };

    fetchAboutData();
  }, []);

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ mt: 6, mb: 6, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 6, mb: 6 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!aboutContent) {
    return null;
  }

  return (
    <Container maxWidth="md" sx={{ mt: 6, mb: 6 }}>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <Paper elevation={3} sx={{ p: { xs: 2, sm: 4 }, background: '#fafbfc', maxWidth: 900, mx: 'auto' }}>
          <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ fontWeight: 600 }}>
            {aboutContent.title}
          </Typography>
          {aboutContent.introParagraphs.map((para, idx) => (
            <Typography
              key={idx}
              variant="body1"
              paragraph
              align="left"
              sx={{ fontSize: '1.15rem', mb: idx === 0 ? 2 : 0, textAlign: 'justify' }}
              dangerouslySetInnerHTML={{ __html: para }}
            />
          ))}
          <Divider sx={{ mb: 3, mt: 6 }} />
          <Box mt={5}>
            <Typography variant="h5" component="h2" gutterBottom align="center" sx={{ fontWeight: 600 }}>
              {aboutContent.booksSectionTitle}
            </Typography>
            <Typography variant="body1" align="left" sx={{ fontSize: '1.1rem', textAlign: 'justify', mb: 4 }}>
              {aboutContent.booksSectionDescription}
            </Typography>
            <Grid container spacing={4} justifyContent="center">
              {books.map((book, idx) => (
                <Grid item xs={12} sm={6} md={4} key={idx}>
                  <motion.div variants={cardVariants}>
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
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Paper>
      </motion.div>
    </Container>
  );
};

export default About;