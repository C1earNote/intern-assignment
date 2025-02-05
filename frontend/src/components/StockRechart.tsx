import React, { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Box } from '@mui/material';
import { StockEntry } from '../types';

interface StockRechartProps {
  data: StockEntry[];
  duration: string;
}

const StockRechart: React.FC<StockRechartProps> = ({ data, duration }) => {
  const memoizedData = useMemo(() => data, [data]);

  // ✅ Function to extract only the date (YYYY-MM-DD)
  const formatLabel = (label: string) => {
    return label.split(" ")[0]; // Removes time
  };

  return (
    <div className="chart-container">
      <Typography variant="h5" gutterBottom>
        {selectedStock.name}
      </Typography>
  
      {stockData &&
        Object.keys(stockData).map((duration) => (
          <Box key={duration} mb={4}>
            <Typography variant="h6" gutterBottom>
              {duration.toUpperCase()}
            </Typography>
            <div
              className="chart-wrapper"
              style={{
                width: '100%',
                maxWidth: '1000px',
                height: '350px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'white',
                borderRadius: '8px',
                boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
                padding: '10px',
              }}
            >
              <StockRechart data={stockData[duration]} duration={duration} />
            </div>
          </Box>
        ))}
    </div>
  );  
};

export default StockRechart;
