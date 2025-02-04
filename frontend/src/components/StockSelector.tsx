import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { MenuItem, Select, FormControl, InputLabel, Box, SelectChangeEvent } from '@mui/material';
import { setSelectedStock, fetchStockData, clearStockData } from '../redux/stockSlice';
import { RootState, AppDispatch } from '../redux/store';

const StockSelector: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const stocks = useSelector((state: RootState) => state.stocks.stocks);
  const selectedStock = useSelector((state: RootState) => state.stocks.selectedStock);
  
  // State to manage selected duration
  const [selectedDuration, setSelectedDuration] = useState<string>('');

  const handleStockChange = (event: SelectChangeEvent<string>) => {
    const selected = stocks.find((stock) => stock.id === event.target.value);
    if (selected) {
      dispatch(setSelectedStock(selected));
      setSelectedDuration(''); // Reset duration when stock changes
    }
  };

  const handleDurationChange = (event: SelectChangeEvent<string>) => {
  const newDuration = event.target.value;
  setSelectedDuration(newDuration);

  console.log("Selected Duration:", newDuration); // ✅ Debugging log

  if (selectedStock) {
    console.log("Clearing previous stock data for:", selectedStock.id);
    dispatch(clearStockData({ id: selectedStock.id }));

    console.log(`Fetching stock data for ${selectedStock.id} - ${newDuration}`);
    dispatch(fetchStockData({ id: selectedStock.id, duration: newDuration }));
  }
};
 

  return (
    <div>
      <Box mb={2}>
        <FormControl fullWidth sx={{ maxWidth: 300 }}>
          <InputLabel id="stock-selector-label">Select Stock</InputLabel>
          <Select
            labelId="stock-selector-label"
            value={selectedStock ? selectedStock.id : ''}
            onChange={handleStockChange}
          >
            {stocks.map((stock) => (
              <MenuItem key={stock.id} value={stock.id}>
                {stock.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {selectedStock && (
        <Box mb={2}>
          <FormControl fullWidth sx={{ maxWidth: 300 }}>
            <InputLabel id="duration-selector-label">Select Duration</InputLabel>
            <Select
              labelId="duration-selector-label"
              value={selectedDuration}
              onChange={handleDurationChange}
            >
              <MenuItem value="all">All Durations</MenuItem>
              {selectedStock.available.map((duration) => (
                <MenuItem key={duration} value={duration}>
                  {duration.toUpperCase()}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      )}
    </div>
  );
};

export default StockSelector;
