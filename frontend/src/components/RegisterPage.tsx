import React, { useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const RegisterPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      // Send a request to the backend to register the user and send the code
      await axios.post('/api/register', { email });
      // Navigate to the 2FA page
      navigate('/2fa');
    } catch (error) {
      console.error('Error registering user:', error);
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100vh"
      bgcolor="white"
      p={3}
      borderRadius={2}
      boxShadow={3}
    >
      <Typography variant="h4" gutterBottom>
        Register
      </Typography>
      <TextField
        label="Email"
        variant="outlined"
        margin="normal"
        fullWidth
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleRegister}
        sx={{ mt: 2 }}
      >
        Register
      </Button>
    </Box>
  );
};

export default RegisterPage;