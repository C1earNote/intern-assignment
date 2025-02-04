import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { CircularProgress, Typography, Box } from '@mui/material';
import StockRechart from './StockRechart';
import { RootState } from '../redux/store';
import { setStockData } from '../redux/stockSlice';
import axios from 'axios';
import { io } from 'socket.io-client';
import { StockEntry } from '../types';

const socket = io('http://localhost:3000'); // Ensure this URL matches your backend URL

const StockChart: React.FC = () => {
  const dispatch = useDispatch();
  const selectedStock = useSelector((state: RootState) => state.stocks.selectedStock);
  const selectedDuration = useSelector((state: RootState) => state.stocks.selectedDuration);
  const stockData = useSelector((state: RootState) => state.stocks.stockData);
  const loading = useSelector((state: RootState) => state.stocks.loading);
  const error = useSelector((state: RootState) => state.stocks.error);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/stock-data');
        const data = response.data;
        const parsedData: StockEntry[] = Object.keys(data).map((timestamp) => ({
          timestamp,
          ...data[timestamp],
        }));
        dispatch(setStockData({ id: 'msft', duration: '6M', data: parsedData }));
      } catch (error) {
        console.error('Error fetching stock data:', error);
      }
    };

    fetchData();

    socket.on('stockUpdate', ({ stockId, duration, data }) => {
      if (selectedStock?.id === stockId && selectedDuration === duration) {
        dispatch(setStockData({ id: stockId, duration, data }));
      }
    });

    return () => {
      socket.off('stockUpdate');
    };
  }, [dispatch, selectedStock, selectedDuration]);

  if (loading) return <div className="loading-indicator"><CircularProgress /></div>;
  if (error) return <Typography color="error">{error}</Typography>;

  if (!selectedStock) {
    return (
      <Box
        className="blank-box"
        sx={{
          width: '80%',
          margin: 'auto',
          padding: '20px',
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
        }}
      />
    );
  }

  const dataset = stockData[selectedStock.id]?.[selectedDuration || ''];

  return (
    <div className="chart-container">
      <Typography variant="h5" gutterBottom>
        {selectedStock.name}
      </Typography>
      {dataset ? (
        <Box mb={4}>
          <Typography variant="h6" gutterBottom>
            {selectedDuration?.toUpperCase()}
          </Typography>
          <StockRechart data={dataset} duration={selectedDuration || ''} />
        </Box>
      ) : (
        <Typography>No data available</Typography>
      )}
    </div>
  );
};

export default StockChart;