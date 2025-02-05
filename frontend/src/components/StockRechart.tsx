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

  // Function to format timestamp (if needed)
  const formatLabel = (label: string) => {
    return label.split(" ")[0]; // Remove time if needed
  };

  return (
    <Box sx={{ width: '100%', height: '100%' }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={memoizedData} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
          <XAxis dataKey="timestamp" tick={{ fill: '#666' }} tickFormatter={formatLabel} />
          <YAxis yAxisId="left" tick={{ fill: '#666' }} tickFormatter={(value) => `$${value}`} />
          <YAxis yAxisId="right" orientation="right" tick={{ fill: '#666' }} tickFormatter={(value) => `${value}`} />
          <Tooltip />
          <Legend />

          {/* Plotting the data */}
          <Line yAxisId="left" type="monotone" dataKey="price" stroke="#2563eb" strokeWidth={2} dot={false} isAnimationActive={false} />
          <Line yAxisId="right" type="monotone" dataKey="volume" stroke="#82ca9d" strokeWidth={2} dot={false} isAnimationActive={false} />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default StockRechart;
