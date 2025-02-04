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

  return (
    <Box
      className="chart-container"
      sx={{
        padding: '16px',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
      }}
    >
      {/* Removed the chart title */}
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={memoizedData} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
          <XAxis dataKey="timestamp" tick={{ fill: '#666' }} />
          <YAxis yAxisId="left" tick={{ fill: '#666' }} tickFormatter={(value) => `$${value}`} />
          <YAxis yAxisId="right" orientation="right" tick={{ fill: '#666' }} tickFormatter={(value) => `${value}`} />
          <Tooltip />
          <Legend />
          
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="price"
            name="Price"
            stroke="#2563eb"
            strokeWidth={2}
            dot={false}
            isAnimationActive
            animationDuration={500} // Smooth transition for updates
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="volume"
            name="Volume"
            stroke="#82ca9d"
            strokeWidth={2}
            dot={false}
            isAnimationActive
            animationDuration={500} // Smooth transition for updates
          />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default StockRechart;
