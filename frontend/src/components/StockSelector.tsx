import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { MenuItem, Select, FormControl, InputLabel, SelectChangeEvent } from "@mui/material";
import { setSelectedStock, fetchStockData } from "../redux/stockSlice";
import { RootState, AppDispatch } from "../redux/store";

const StockSelector = () => {
  const dispatch = useDispatch<AppDispatch>();
  const stocks = useSelector((state: RootState) => state.stocks.stocks);
  const selectedStock = useSelector((state: RootState) => state.stocks.selectedStock);

  // Update event signature to match MUI's SelectChangeEvent type
  const handleStockChange = (event: SelectChangeEvent<string>) => {
    const selected = stocks.find((stock) => stock.id === event.target.value);
    if (selected) {
      dispatch(setSelectedStock(selected));
    }
  };

  const handleDurationChange = (event: SelectChangeEvent<string>) => {
    if (selectedStock) {
      dispatch(fetchStockData({ id: selectedStock.id, duration: event.target.value }));
    }
  };

  return (
    <FormControl fullWidth>
      <InputLabel>Select Stock</InputLabel>
      <Select value={selectedStock ? selectedStock.id : ""} onChange={handleStockChange}>
        {stocks.map((stock) => (
          <MenuItem key={stock.id} value={stock.id}>
            {stock.name}
          </MenuItem>
        ))}
      </Select>

      {selectedStock && (
        <Select onChange={handleDurationChange}>
          {selectedStock.available.map((duration) => (
            <MenuItem key={duration} value={duration}>
              {duration.toUpperCase()}
            </MenuItem>
          ))}
        </Select>
      )}
    </FormControl>
  );
};

export default StockSelector;
