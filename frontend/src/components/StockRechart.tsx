import React from 'react';
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
import { Typography, Box } from '@mui/material';
import { StockEntry } from '../types';

interface StockRechartProps {
  data: StockEntry[];
  duration: string; // Added duration prop to display inside the chart
}

const StockRechart: React.FC<StockRechartProps> = ({ data, duration }) => {
  const formatTooltipValue = (value: number, name: string) => {
    if (name === 'Price') {
      return [`$${value.toFixed(2)}`, 'Price'];
    }
    return [value.toFixed(0), 'Volume'];
  };

  const formatLabel = (label: string | number) => {
    const date = new Date(label);
    return isNaN(date.getTime()) ? String(label) : date.toLocaleDateString();
  };

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
      <Typography variant="h6" gutterBottom sx={{ textAlign: 'center' }}>
        {duration.toUpperCase()} Stock Chart
      </Typography>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
          <XAxis dataKey="timestamp" tick={{ fill: '#666' }} tickFormatter={formatLabel} />
          <YAxis yAxisId="left" tick={{ fill: '#666' }} tickFormatter={(value) => `$${value}`} />
          <YAxis yAxisId="right" orientation="right" tick={{ fill: '#666' }} tickFormatter={(value) => `${value}`} />
          <Tooltip formatter={(value, name) => formatTooltipValue(value as number, name as string)} labelFormatter={formatLabel} />
          <Legend />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="price"
            name="Price"
            stroke="#2563eb"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 5, stroke: '#2563eb', strokeWidth: 2, fill: 'white' }}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="volume"
            name="Volume"
            stroke="#82ca9d"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 5, stroke: '#82ca9d', strokeWidth: 2, fill: 'white' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default StockRechart;