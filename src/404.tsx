import { Box, Container, Typography } from '@mui/material';

export default function NotFoundPage() {
  return (
    <Container component="main" maxWidth="sm" sx={{ mt: 16, textAlign: 'center' }}>
      <Box sx={{ bgcolor: "white", p: 6, borderRadius: '16px', boxShadow: 3 }}>
        <Typography variant="h1" component="h2" gutterBottom sx={{ fontSize: '5rem', fontWeight: 'bold', color: "red" }}>
          404
        </Typography>
        <Typography variant="h5" gutterBottom sx={{ mb: 3, color: '#0d47a1' }}>
          Oops! Page not found.
        </Typography>
        <Typography variant="body1" gutterBottom sx={{ mb: 4 }}>
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </Typography>
      </Box>
    </Container>
  );
};

