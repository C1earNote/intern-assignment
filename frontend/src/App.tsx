import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Typography, Container, Box } from '@mui/material';
import { fetchStocks } from './redux/stockSlice';
import { AppDispatch } from './redux/store';
import StockSelector from './components/StockSelector';
import StockChart from './components/StockChart';
import LoginPage from './components/LoginPage';
import TwoFactorAuthPage from './components/TwoFactorAuthPage';
import RegisterPage from './components/RegisterPage';

function App() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchStocks());
  }, [dispatch]);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/2fa" element={<TwoFactorAuthPage />} />
        <Route path="/main" element={
          <Container>
            <Box my={4}>
              <Typography variant="h2" component="h1" gutterBottom>
                Tanishq's Stock App
              </Typography>
              <StockSelector />
              <StockChart />
            </Box>
          </Container>
        } />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;