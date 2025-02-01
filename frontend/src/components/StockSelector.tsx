import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import { setSelectedStock, fetchStockData } from "../redux/stockSlice";
import { RootState, AppDispatch } from "../redux/store";

const StockSelector = () => {
  const dispatch = useDispatch<AppDispatch>();
  const stocks = useSelector((state: RootState) => state.stocks.stocks);
  const selectedStock = useSelector((state: RootState) => state.stocks.selectedStock);
  const [selectedDuration, setSelectedDuration] = useState<string>(""); // Add state for duration

  const handleStockChange = (event: any) => {
    const selected = stocks.find((stock) => stock.id === event.target.value);
    if (selected) {
      dispatch(setSelectedStock(selected));
      setSelectedDuration(""); // Reset duration when stock changes
    }
  };

  const handleDurationChange = (event: any) => {
    const duration = event.target.value;
    setSelectedDuration(duration);
    if (selectedStock) {
      dispatch(fetchStockData({ 
        id: selectedStock.id, 
        duration: duration.toLowerCase() // Ensure lowercase to match backend
      }));
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", margin: "20px 0" }}>
      <FormControl variant="outlined" style={{ minWidth: 200, marginRight: 10 }}>
        <InputLabel>Select Stock</InputLabel>
        <Select value={selectedStock?.id || ""} onChange={handleStockChange}>
          {stocks.map((stock) => (
            <MenuItem key={stock.id} value={stock.id}>
              {stock.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {selectedStock && (
        <FormControl variant="outlined" style={{ minWidth: 200 }}>
          <InputLabel>Select Duration</InputLabel>
          <Select 
            value={selectedDuration}
            onChange={handleDurationChange}
          >
            {selectedStock.available.map((duration) => (
              <MenuItem key={duration} value={duration}>
                {duration.toUpperCase()}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}
    </div>
  );
};

export default StockSelector;
