import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { CircularProgress, Typography, Box } from '@mui/material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import StockRechart from './StockRechart';
import { RootState } from '../redux/store';
import { io } from 'socket.io-client';
import axios from 'axios';
import { StockEntry } from '../types';

const socket = io('http://localhost:3000'); // Ensure this matches your backend URL

// ✅ Fetch stock data from API (supports incremental updates)
const fetchStockData = async ({ stockId, duration }: { stockId: string; duration: string }) => {
  const response = await axios.post(`http://localhost:3000/api/stocks/${stockId}`, { duration });
  return response.data;
};

const StockChart: React.FC = () => {
  const selectedStock = useSelector((state: RootState) => state.stocks.selectedStock);
  const selectedDuration = useSelector((state: RootState) => state.stocks.selectedDuration);
  const queryClient = useQueryClient();

  // **Fetch stock data every 5 seconds (incremental updates)**
  const { data: stockData, isLoading, error } = useQuery({
    queryKey: ['stockData', selectedStock?.id, selectedDuration],
    queryFn: () => fetchStockData({ stockId: selectedStock!.id, duration: selectedDuration! }),
    enabled: !!selectedStock && !!selectedDuration,
    refetchInterval: 5000, // **Poll every 5 seconds**
    placeholderData: (previousData) => previousData, // ✅ Prevents flickering & keeps previous data while fetching
  });

  // ✅ Mutation to append new data instead of replacing it
  const mutation = useMutation({
    mutationFn: async ({ stockId, duration, newData }: { stockId: string; duration: string; newData: StockEntry[] }) => {
      queryClient.setQueryData(['stockData', stockId, duration], (oldData: StockEntry[] | undefined) => {
        // ✅ Append new data, avoiding duplicates
        const mergedData = [...(oldData || []), ...newData];
        return Array.from(new Map(mergedData.map(item => [item.timestamp, item])).values()); // Remove duplicate timestamps
      });
      return Promise.resolve();
    },
  });

  // ✅ Listen for real-time updates from WebSocket
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
        {stockData ? <StockRechart data={stockData} duration={selectedDuration!} /> : <Typography>No data available</Typography>}
      </Box>
    </div>
  );
};

export default StockChart;
