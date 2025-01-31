import React, { useState } from "react";  // Import useState
import { Line } from "react-chartjs-2";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { ChartData, ChartOptions } from "chart.js";
import { CircularProgress, Box, Typography } from "@mui/material";

// StockEntry type for better type-checking
interface StockEntry {
  timestamp: string;
  price: number;
}

const StockChart = () => {
  const selectedStock = useSelector((state: RootState) => state.stocks.selectedStock);
  const stockData = useSelector((state: RootState) => state.stocks.stockData);

  // State for the selected duration (defaults to 1Y)
  const [duration, setDuration] = useState<string>("1y");

  // If no selectedStock or data for the selectedStock, show loading
  if (!selectedStock || !stockData[selectedStock.id] || !stockData[selectedStock.id][duration]) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  const dataset: StockEntry[] = stockData[selectedStock.id][duration] || [];

  const chartData: ChartData<"line"> = {
    labels: dataset.map((entry) => new Date(entry.timestamp).toLocaleDateString()),
    datasets: [
      {
        label: selectedStock.name,
        data: dataset.map((entry) => entry.price),
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderWidth: 2,
        pointRadius: 4,
        pointBackgroundColor: "rgb(75, 192, 192)",
      },
    ],
  };

  const chartOptions: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: {
          display: true,
        },
      },
      y: {
        grid: {
          display: true,
        },
        beginAtZero: true,
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.raw as number; // Cast to number to fix type issue
            return `$${value.toFixed(2)}`; // Format the tooltip label
          },
        },
      },
    },
  };

  return (
    <Box sx={{ height: "400px", padding: 2 }}>
      <Typography variant="h6" gutterBottom>
        Stock Price: {selectedStock.name} ({duration.toUpperCase()})
      </Typography>
      <Line data={chartData} options={chartOptions} />
    </Box>
  );
};

export default StockChart;
