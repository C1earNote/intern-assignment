import React from 'react';
import { useSelector } from 'react-redux';
import { CircularProgress, Typography, Box } from '@mui/material';
import StockRechart from './StockRechart';
import { RootState } from '../redux/store';

const StockChart: React.FC = () => {
  const selectedStock = useSelector((state: RootState) => state.stocks.selectedStock);
  const stockData = useSelector((state: RootState) => state.stocks.stockData);
  const loading = useSelector((state: RootState) => state.stocks.loading);
  const error = useSelector((state: RootState) => state.stocks.error);

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

  return (
    <div className="chart-container">
      <Typography variant="h5" gutterBottom>
        {selectedStock.name} Stock Price
      </Typography>
      {selectedStock.available.map((duration) => {
        const dataset = stockData[selectedStock.id]?.[duration];
        return (
          <Box key={duration} mb={4}>
            <Typography variant="h6" gutterBottom>
              {duration.toUpperCase()}
            </Typography>
            {dataset ? (
              <StockRechart data={dataset} />
            ) : (
              <Typography>Loading data for {duration}...</Typography>
            )}
          </Box>
        );
      })}
    </div>
  );
};

export default StockChart;