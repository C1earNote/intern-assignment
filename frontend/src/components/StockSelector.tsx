import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { MenuItem, Select, FormControl, InputLabel, Box, SelectChangeEvent } from '@mui/material';
import { setSelectedStock, fetchStockData } from '../redux/stockSlice';
import { RootState, AppDispatch } from '../redux/store';

const StockSelector: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const stocks = useSelector((state: RootState) => state.stocks.stocks);
  const selectedStock = useSelector((state: RootState) => state.stocks.selectedStock);

  const handleStockChange = (event: SelectChangeEvent<string>) => {
    const selected = stocks.find((stock) => stock.id === event.target.value);
    if (selected) {
      dispatch(setSelectedStock(selected));
      selected.available.forEach((duration) => {
        dispatch(fetchStockData({ id: selected.id, duration }));
      });
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
    </div>
  );
};

export default StockSelector;