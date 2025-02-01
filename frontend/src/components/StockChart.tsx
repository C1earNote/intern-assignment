import React from "react";
import { Line } from "react-chartjs-2";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { ChartData } from "chart.js";
import { CircularProgress, Typography } from "@mui/material";

const StockChart = () => {
  const selectedStock = useSelector((state: RootState) => state.stocks.selectedStock);
  const selectedDuration = useSelector((state: RootState) => state.stocks.selectedDuration);
  const stockData = useSelector((state: RootState) => state.stocks.stockData);
  const loading = useSelector((state: RootState) => state.stocks.loading);
  const error = useSelector((state: RootState) => state.stocks.error);

  if (loading) return <CircularProgress style={{ margin: '20px auto' }} />;
  
  if (error) return <Typography color="error">{error}</Typography>;

  if (!selectedStock || !selectedDuration || !stockData[selectedStock.id]?.[selectedDuration]) {
    return <Typography>Select a stock and duration to view data</Typography>;
  }

  const dataset = stockData[selectedStock.id][selectedDuration];
  console.log("Dataset:", dataset);
  
  const chartData: ChartData<"line"> = {
    labels: dataset.map((entry) => new Date(entry.timestamp).toLocaleDateString()),
    datasets: [
      {
        label: `${selectedStock.name} (${selectedDuration.toUpperCase()})`,
        data: dataset.map((entry) => entry.price),
        borderColor: "#007bff",
        backgroundColor: "rgba(0, 123, 255, 0.1)",
        borderWidth: 2,
        pointRadius: 3,
      },
    ],
  };

  return (
    <div style={{ width: "80%", margin: "auto", padding: "20px" }}>
      <Typography variant="h5" gutterBottom>
        {selectedStock.name} Stock Price
      </Typography>
      <Line data={chartData} />
    </div>
  );
};

export default StockChart;
