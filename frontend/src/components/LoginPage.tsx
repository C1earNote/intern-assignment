import React, { useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    // Implement your login logic here
    // For now, we'll just navigate to the 2FA page
    navigate('/2fa');
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
        Login (Not developed fully, enter anything to login)
      </Typography>
      <TextField
        label="Username"
        variant="outlined"
        margin="normal"
        fullWidth
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <TextField
        label="Password"
        type="password"
        variant="outlined"
        margin="normal"
        fullWidth
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleLogin}
        sx={{ mt: 2 }}
      >
        Login
      </Button>
    </Box>
  );
};

export default LoginPage;