import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface StockEntry {
  timestamp: string;
  price: number;
}

interface StockRechartProps {
  data: StockEntry[];
}

const StockRechart: React.FC<StockRechartProps> = ({ data }) => {
  const formatTooltipValue = (value: number) => [`$${value.toFixed(2)}`, 'Price'];

  const formatLabel = (label: string | number) => {
    const date = new Date(label);
    return isNaN(date.getTime()) ? String(label) : date.toLocaleDateString();
  };

  return (
    <div className="chart-container">
      <ResponsiveContainer width="100%" height={170}>
        <LineChart
          data={data}
          margin={{ top: 10, right: 30, left: 10, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
          <XAxis dataKey="timestamp" tick={{ fill: '#666' }} tickFormatter={formatLabel} />
          <YAxis tick={{ fill: '#666' }} tickFormatter={(value) => `$${value}`} />
          <Tooltip formatter={(value) => formatTooltipValue(value as number)} labelFormatter={formatLabel} />
          <Line
            type="monotone"
            dataKey="price"
            stroke="#2563eb"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 5, stroke: '#2563eb', strokeWidth: 2, fill: 'white' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StockRechart;
