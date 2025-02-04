import React, { useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { CircularProgress, Typography, Box } from '@mui/material';
import StockRechart from './StockRechart';
import { RootState, AppDispatch } from '../redux/store';
import { setStockData, fetchStockData } from '../redux/stockSlice';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000'); // Ensure this matches your backend URL

const StockChart: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const selectedStock = useSelector((state: RootState) => state.stocks.selectedStock);
  const selectedDuration = useSelector((state: RootState) => state.stocks.selectedDuration);
  const stockData = useSelector((state: RootState) => state.stocks.stockData);
  const loading = useSelector((state: RootState) => state.stocks.loading);
  const error = useSelector((state: RootState) => state.stocks.error);
  const [polling, setPolling] = useState(false);

  const fetchData = useCallback(async () => {
    if (selectedStock && selectedDuration) {
      const result = await dispatch(fetchStockData({ id: selectedStock.id, duration: selectedDuration }));
      if (result.payload && typeof result.payload === 'object' && 'data' in result.payload) {
        const data = (result.payload as { data: any[] }).data;
        if (Array.isArray(data) && data.length > 0) {
          dispatch(setStockData({ id: selectedStock.id, duration: selectedDuration, data }));
        }
      }
    }
  }, [dispatch, selectedStock, selectedDuration]);

  useEffect(() => {
    let pollingInterval: NodeJS.Timeout;

    if (selectedStock && selectedDuration) {
      setPolling(true);
      fetchData();

      pollingInterval = setInterval(() => {
        fetchData();
      }, 30000); // Poll every 30 seconds

      return () => {
        clearInterval(pollingInterval);
        setPolling(false);
      };
    }
  }, [fetchData, selectedStock, selectedDuration]);

  useEffect(() => {
    const handleStockUpdate = ({ stockId, duration, data }: { stockId: string; duration: string; data: any[] }) => {
      if (selectedStock?.id === stockId && (selectedDuration === duration || selectedDuration === "ALL")) {
        if (Array.isArray(data) && data.length > 0) {
          dispatch(setStockData({ id: stockId, duration, data }));
        }
      }
    };

    socket.on('stockUpdate', handleStockUpdate);

    return () => {
      socket.off('stockUpdate', handleStockUpdate);
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
          height: '400px',
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
    <Box
      className="chart-container"
      sx={{
        width: '80%',
        margin: 'auto',
        padding: '20px',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
        height: '100%', // Ensure the container height is consistent
      }}
    >
      <Typography variant="h5" gutterBottom>{selectedStock.name}</Typography>
      {durationsToShow.map((duration) => {
        if (duration === null) return null;
        const dataset = stockData[selectedStock.id]?.[duration];

        return (
          <Box key={duration} mb={4} sx={{ height: '400px' }}>
            <Typography variant="h6" gutterBottom>{duration.toUpperCase()}</Typography>
            {dataset ? (
              <StockRechart data={dataset} duration={duration} />
            ) : (
              <Typography>No data available</Typography>
            )}
          </Box>
        );
      })}
    </Box>
  );
};

export default StockChart;