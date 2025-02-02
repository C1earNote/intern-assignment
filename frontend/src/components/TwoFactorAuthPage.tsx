import React, { useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const TwoFactorAuthPage: React.FC = () => {
  const [code, setCode] = useState('');
  const navigate = useNavigate();

  const handleVerify = () => {
    // Implement your 2FA verification logic here
    // For now, we'll just navigate to the main page
    navigate('/main');
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
        Two-Factor Authentication (Enter Anything, for now)
      </Typography>
      <TextField
        label="2FA Code"
        variant="outlined"
        margin="normal"
        fullWidth
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleVerify}
        sx={{ mt: 2 }}
      >
        Verify
      </Button>
    </Box>
  );
};

export default TwoFactorAuthPage;