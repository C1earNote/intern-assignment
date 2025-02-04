import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { CircularProgress, Typography, Box } from '@mui/material';
import StockRechart from './StockRechart';
import { RootState, AppDispatch } from '../redux/store';
import { setStockData, fetchStockData } from '../redux/stockSlice';
import { io } from 'socket.io-client';
//import { StockEntry } from '../types';

const socket = io('http://localhost:3000'); // Ensure this URL matches your backend URL

const StockChart: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const selectedStock = useSelector((state: RootState) => state.stocks.selectedStock);
  const selectedDuration = useSelector((state: RootState) => state.stocks.selectedDuration);
  const stockData = useSelector((state: RootState) => state.stocks.stockData);
  const loading = useSelector((state: RootState) => state.stocks.loading);
  const error = useSelector((state: RootState) => state.stocks.error);

  useEffect(() => {
    if (selectedStock && selectedDuration) {
      if (selectedDuration === "ALL") {
        selectedStock.available.forEach((duration) => {
          dispatch(fetchStockData({ id: selectedStock.id, duration }));
        });
      } else {
        dispatch(fetchStockData({ id: selectedStock.id, duration: selectedDuration }));
      }
    }

    socket.on('stockUpdate', ({ stockId, duration, data }) => {
      if (selectedStock?.id === stockId && (selectedDuration === duration || selectedDuration === "ALL")) {
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

  const durationsToShow = selectedDuration === "ALL" ? selectedStock.available : [selectedDuration];

  return (
    <div className="chart-container">
      <Typography variant="h5" gutterBottom>
        {selectedStock.name}
      </Typography>
      {durationsToShow.map((duration) => {
        if (duration === null) return null; // Ensure duration is not null
        const dataset = stockData[selectedStock.id]?.[duration];
        return (
          <Box key={duration} mb={4}>
            <Typography variant="h6" gutterBottom>
              {duration.toUpperCase()}
            </Typography>
            {dataset ? (
              <StockRechart data={dataset} duration={duration} />
            ) : (
              <Typography>No data available</Typography>
            )}
          </Box>
        );
      })}
    </div>
  );
};

export default StockChart;