import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { CircularProgress, Typography, Box } from '@mui/material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import StockRechart from './StockRechart';
import { RootState } from '../redux/store';
import { io } from 'socket.io-client';
import { StockEntry } from '../types';

// Socket connection to the backend
const socket = io('http://localhost:3000'); // Ensure this matches your backend URL

// Fetch stock data for a specific duration
const fetchStockData = async ({ stockId, duration }: { stockId: string; duration: string }) => {
  const response = await fetch(`http://localhost:3000/api/stocks/${stockId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ duration }),
  });
  return response.json();
};

// Fetch all stock data for all durations
const fetchAllStockData = async (stockId: string) => {
  const response = await fetch(`http://localhost:3000/api/stocks/${stockId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ duration: 'ALL' }),
  });
  return response.json(); // Expected format: { '1Y': [], '5Y': [], '6M': [] }
};

const StockChart: React.FC = () => {
  const selectedStock = useSelector((state: RootState) => state.stocks.selectedStock);
  const selectedDuration = useSelector((state: RootState) => state.stocks.selectedDuration);
  const queryClient = useQueryClient();

  // Fetch stock data every 5 seconds (incremental updates)
  const { data: stockData, isLoading, error } = useQuery({
    queryKey: ['stockData', selectedStock?.id, selectedDuration],
    queryFn: () => {
      return selectedDuration === 'ALL'
        ? fetchAllStockData(selectedStock!.id)
        : fetchStockData({ stockId: selectedStock!.id, duration: selectedDuration! });
    },
    enabled: !!selectedStock,
    refetchInterval: 5000, // Poll every 5 seconds
    placeholderData: (previousData) => previousData, // Prevent flickering
  });

  const mutation = useMutation({
    mutationFn: async ({ stockId, duration, newData }: { stockId: string; duration: string; newData: StockEntry[] }) => {
      queryClient.setQueryData(['stockData', stockId, duration], (oldData: StockEntry[] | undefined) => {
        // Append new data, avoiding duplicates
        const mergedData = [...(oldData || []), ...newData];
        return Array.from(new Map(mergedData.map(item => [item.timestamp, item])).values()); // Remove duplicate timestamps
      });
      return Promise.resolve();
    },
  });

  useEffect(() => {
    socket.on('stockUpdate', ({ stockId, duration, data }) => {
      if (selectedStock?.id === stockId && (selectedDuration === duration || selectedDuration === 'ALL')) {
        mutation.mutate({ stockId, duration, newData: data });
      }
    });

    return () => {
      socket.off('stockUpdate');
    };
  }, [selectedStock, selectedDuration]);

  if (isLoading) return <CircularProgress />;
  if (error) return <Typography color="error">Failed to load stock data</Typography>;

  if (!selectedStock) {
    return (
      <Box sx={{ width: '80%', margin: 'auto', padding: '20px', backgroundColor: 'white', borderRadius: '8px' }} />
    );
  }

  return (
    <div className="chart-container">
      <Typography variant="h5" gutterBottom>
        {selectedStock.name}
      </Typography>
      <Box sx={{ width: '100%', maxWidth: '1000px', height: '350px', overflow: 'hidden', padding: '10px' }}>
        {selectedDuration === 'ALL' ? (
          // Render multiple charts for each available duration
          Object.keys(stockData).map((duration) => (
            <Box key={duration} sx={{ marginBottom: '20px' }}>
              <Typography variant="h6">{duration}</Typography>
              <StockRechart data={stockData[duration]} duration={duration} />
            </Box>
          ))
        ) : (
          // Render a single chart for the selected duration
          <StockRechart data={stockData} duration={selectedDuration!} />
        )}
      </Box>
    </div>
  );
};

export default StockChart;
