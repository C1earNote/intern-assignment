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

// ✅ Fetch stock data (supports "ALL" durations)
const fetchStockData = async ({
  stockId,
  duration,
}: {
  stockId: string;
  duration: string;
}): Promise<Record<string, StockEntry[]> | null> => {
  if (duration === 'ALL') {
    try {
      const response = await axios.get(`http://localhost:3000/api/stocks/${stockId}/all`);
      return response.data; // Expected format: { duration1: data1, duration2: data2, ... }
    } catch (error) {
      console.error('Error fetching stock data for ALL:', error);
      return null;
    }
  } else {
    try {
      const response = await axios.post(`http://localhost:3000/api/stocks/${stockId}`, { duration });
      return { [duration]: response.data }; // Ensure consistent structure
    } catch (error) {
      console.error('Error fetching stock data:', error);
      return null;
    }
  }
};

const StockChart: React.FC = () => {
  const selectedStock = useSelector((state: RootState) => state.stocks.selectedStock);
  const selectedDuration = useSelector((state: RootState) => state.stocks.selectedDuration);
  const queryClient = useQueryClient();

  // ✅ Fetch stock data (polling every 5s)
  const {
    data: stockData,
    isLoading,
    error,
  } = useQuery<Record<string, StockEntry[]> | null>({
    queryKey: ['stockData', selectedStock?.id, selectedDuration],
    queryFn: () =>
      fetchStockData({
        stockId: selectedStock!.id,
        duration: selectedDuration!,
      }),
    enabled: !!selectedStock && !!selectedDuration,
    refetchInterval: 5000,
    placeholderData: (previousData) => previousData, // Prevents flickering
  });

  // ✅ Mutation for real-time updates
  const mutation = useMutation({
    mutationFn: async ({
      stockId,
      duration,
      newData,
    }: {
      stockId: string;
      duration: string;
      newData: StockEntry[];
    }) => {
      queryClient.setQueryData(['stockData', stockId, duration], (oldData: Record<string, StockEntry[]> | null) => {
        if (!oldData) return { [duration]: newData }; // Initialize if empty

        const updatedData = {
          ...oldData,
          [duration]: [...(oldData[duration] || []), ...newData],
        };

        // Remove duplicate timestamps
        updatedData[duration] = Array.from(new Map(updatedData[duration].map((item) => [item.timestamp, item])).values());

        return updatedData;
      });

      return Promise.resolve();
    },
  });

  // ✅ Listen for WebSocket real-time updates
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

  if (!selectedStock || !selectedDuration) {
    return (
      <Typography variant="h6" sx={{ textAlign: 'center', marginTop: 4 }}>
        Select a stock and duration to view the chart.
      </Typography>
    );
  }

  if (isLoading) return <CircularProgress sx={{ display: 'block', margin: 'auto', mt: 4 }} />;
  if (error) return <Typography color="error">Failed to load stock data</Typography>;

  return (
    <div className="chart-container">
      <Typography variant="h5" gutterBottom>
        {selectedStock.name}
      </Typography>
      <Box sx={{ width: '100%', maxWidth: '1000px', overflowY: 'auto', maxHeight: '600px', padding: '10px' }}>
        {stockData ? (
          selectedDuration === 'ALL' ? (
            // ✅ Loop through all durations and render multiple graphs
            Object.entries(stockData).map(([duration, data]) => (
              <Box key={duration} sx={{ marginBottom: '20px' }}>
                <Typography variant="h6">{duration}</Typography>
                <StockRechart data={data} duration={duration} />
              </Box>
            ))
          ) : (
            // ✅ Single graph for selected duration
            stockData[selectedDuration] ? (
              <StockRechart data={stockData[selectedDuration]} duration={selectedDuration} />
            ) : (
              <Typography>No data available</Typography>
            )
          )
        ) : (
          <Typography>No data available</Typography>
        )}
      </Box>
    </div>
  );
};

export default StockChart;
