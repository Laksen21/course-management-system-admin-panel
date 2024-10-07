import './LoginForm.css';
import React, { useState } from 'react';
import { Box, Card, CardContent, TextField, Button, Typography, Container } from '@mui/material';

function LoginForm({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ username: false, password: false });

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!validateForm()) return; // Prevent submission if validation fails
    onLogin({ username, password });
  };

  // Add validation for empty fields
  const validateForm = () => {
    const newErrors = {
      username: username === '',
      password: password === ''
    };
    setErrors(newErrors);
    return !Object.values(newErrors).includes(true); // Return true if no errors
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'username') {
      setUsername(value);
    } else if (name === 'password') {
      setPassword(value);
    }
    
    setErrors(prevErrors => ({
      ...prevErrors,
      [name]: value === ''
    }));
  };

  return (
    <Container maxWidth="sm" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }} className="login-container">
      <Card sx={{ width: '100%', maxWidth: 400 }}>
        <CardContent>
          <Typography variant="h4" textAlign={"center"} fontWeight={"bold"} component="div" gutterBottom sx={{ mt: 2 }}>
            Login
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, mx: 4 }}>
            <TextField
              variant="standard"
              margin="normal"
              fullWidth
              id="email"
              label="Username"
              name="username"
              autoComplete="username"
              autoFocus
              value={username}
              onChange={handleInputChange}
              error={errors.username}
              helperText={errors.username ? 'Username is required' : ''}
            />
            <TextField
              variant="standard"
              margin="normal"
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={handleInputChange}
              error={errors.password}
              helperText={errors.password ? 'Password is required' : ''}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default LoginForm;