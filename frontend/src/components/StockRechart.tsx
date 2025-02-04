import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { StockEntry } from '../types';
import { format } from 'date-fns';

interface StockRechartProps {
  data: StockEntry[];
  duration: string;
}

const StockRechart: React.FC<StockRechartProps> = ({ data, duration }) => {
  const formatXAxis = (tickItem: string) => {
    return format(new Date(tickItem), 'dd/MM/yyyy'); // Format date as 'dd/MM/yyyy'
  };

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="timestamp" tickFormatter={formatXAxis} label={{ value: 'Date', position: 'insideBottomRight', offset: -5 }} />
        <YAxis yAxisId="left" label={{ value: 'Price', angle: -90, position: 'insideLeft' }} />
        <YAxis yAxisId="right" orientation="right" label={{ value: 'Volume', angle: -90, position: 'insideRight' }} />
        <Tooltip contentStyle={{ backgroundColor: '#f5f5f5', border: '1px solid #ccc' }} />
        <Legend verticalAlign="top" height={36} />
        <Line yAxisId="left" type="monotone" dataKey="price" stroke="#8884d8" isAnimationActive={false} dot={false} />
        <Line yAxisId="right" type="monotone" dataKey="volume" stroke="#82ca9d" isAnimationActive={false} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default React.memo(StockRechart);