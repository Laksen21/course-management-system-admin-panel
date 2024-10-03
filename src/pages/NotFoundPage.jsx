import React from 'react';
import { Typography, Container, Box } from '@mui/material';

const NotFound = () => {
  return (
    <Container>
      <Box sx={{ mt: 8, textAlign: 'center' }}>
        <Typography variant="h1" component="h1" gutterBottom>
          404
        </Typography>
        <Typography variant="h4" component="h2" gutterBottom>
          Page Not Found
        </Typography>
        <Typography variant="body1">
          The page you're looking for doesn't exist or has been moved.
        </Typography>
      </Box>
    </Container>
  );
};

export default NotFound;