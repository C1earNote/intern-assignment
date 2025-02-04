import React from 'react';
import { useSelector } from 'react-redux';
import { CircularProgress, Typography, Box } from '@mui/material';
import StockRechart from './StockRechart';
import { RootState } from '../redux/store';

const StockChart: React.FC = () => {
  const selectedStock = useSelector((state: RootState) => state.stocks.selectedStock);
  const stockData = useSelector((state: RootState) => state.stocks.stockData);
  const selectedDuration = useSelector((state: RootState) => state.stocks.selectedDuration);
  const loading = useSelector((state: RootState) => state.stocks.loading);
  const error = useSelector((state: RootState) => state.stocks.error);

  if (loading) return <div className="loading-indicator"><CircularProgress /></div>;
  if (error) return <Typography color="error">{error}</Typography>;

  if (!selectedStock || !selectedDuration) {
    return null; // Don't render anything if no stock or duration is selected
  }

  const dataset = stockData[selectedStock.id]?.[selectedDuration];

  if (!dataset) return null; // Hide if no data available


  return (
  <div className="chart-container">
    <Typography variant="h5" gutterBottom>
      {selectedStock.name} Stock Price
    </Typography>

    <Box mb={4} sx={{ padding: '16px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)' }}>
      <Typography variant="h6" gutterBottom align="center">
        {selectedDuration.toUpperCase()}
      </Typography>
      <StockRechart data={dataset} />
    </Box>
  </div>
);

};

export default StockChart;
