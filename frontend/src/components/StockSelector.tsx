import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { MenuItem, Select, FormControl, InputLabel, Box, SelectChangeEvent, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { setSelectedStock, setSelectedDuration, fetchStockData } from '../redux/stockSlice';
import { RootState, AppDispatch } from '../redux/store';

const StockSelector: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const stocks = useSelector((state: RootState) => state.stocks.stocks);
  const selectedStock = useSelector((state: RootState) => state.stocks.selectedStock);
  const selectedDuration = useSelector((state: RootState) => state.stocks.selectedDuration);

  const handleStockChange = (event: SelectChangeEvent<string>) => {
    const selected = stocks.find((stock) => stock.id === event.target.value);
    if (selected) {
      dispatch(setSelectedStock(selected));
    }
  };

  const handleDurationChange = (_event: React.MouseEvent<HTMLElement>, duration: string | null) => {
    if (duration) {
      dispatch(setSelectedDuration(duration));

      if (selectedStock) {
        if (duration === "ALL") {
          selectedStock.available.forEach((dur) => {
            dispatch(fetchStockData({ id: selectedStock.id, duration: dur }));
          });
        } else {
          dispatch(fetchStockData({ id: selectedStock.id, duration }));
        }
      }
    }
  };

  return (
    <Box mb={2} display="flex" flexDirection="column" gap={2}>
      {/* Stock Dropdown */}
      <FormControl fullWidth sx={{ maxWidth: 250 }}>
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

      {/* Duration Buttons */}
      {selectedStock && (
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: 1,
          }}
        >
          <ToggleButtonGroup
            value={selectedDuration}
            exclusive
            onChange={handleDurationChange}
            aria-label="stock duration"
            sx={{ gap: 1, flexWrap: 'wrap' }}
          >
            <ToggleButton
              value="ALL"
              sx={{
                padding: '8px 16px',
                borderRadius: '8px !important', // Ensures independent buttons
                border: '1px solid #ccc !important', // Makes sure each button has a clean border
                color: '#333',
                backgroundColor: selectedDuration === "ALL" ? '#2563eb' : 'white',
                '&:hover': { backgroundColor: '#e3e3e3' },
                '&.Mui-selected': { backgroundColor: '#2563eb', color: 'white' },
              }}
            >
              All
            </ToggleButton>
            {selectedStock.available.map((duration) => (
              <ToggleButton
                key={duration}
                value={duration}
                sx={{
                  padding: '8px 16px',
                  borderRadius: '8px !important',
                  border: '1px solid #ccc !important',
                  color: '#333',
                  backgroundColor: selectedDuration === duration ? '#2563eb' : 'white',
                  '&:hover': { backgroundColor: '#e3e3e3' },
                  '&.Mui-selected': { backgroundColor: '#2563eb', color: 'white' },
                }}
              >
                {duration.toUpperCase()}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Box>
      )}
    </Box>
  );
};

export default StockSelector;