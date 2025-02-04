import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { StockEntry } from '../types';

interface StockDataState {
  [key: string]: {
    [key: string]: StockEntry[];
  };
}

interface Stock {
  id: string;
  name: string;
  available: string[];
}

interface StockState {
  stocks: Stock[];
  selectedStock: Stock | null;
  selectedDuration: string | null;
  stockData: StockDataState;
  loading: boolean;
  error: string | null;
}

const initialState: StockState = {
  stocks: [],
  selectedStock: null,
  selectedDuration: null,
  stockData: {},
  loading: false,
  error: null,
};

export const fetchStocks = createAsyncThunk('stocks/fetchStocks', async () => {
  const response = await axios.get('http://localhost:3000/api/stocks');
  return response.data;
});

export const fetchStockData = createAsyncThunk(
  'stocks/fetchStockData',
  async ({ id, duration }: { id: string; duration: string }) => {
    const response = await axios.post(`http://localhost:3000/api/stocks/${id}`, { duration });
    return { id, duration, data: response.data };
  }
);

const stockSlice = createSlice({
  name: 'stocks',
  initialState,
  reducers: {
    setSelectedStock(state, action: PayloadAction<Stock | null>) {
      state.selectedStock = action.payload;
    },
    setSelectedDuration(state, action: PayloadAction<string | null>) {
      state.selectedDuration = action.payload;
    },
    setStockData(state, action: PayloadAction<{ id: string; duration: string; data: StockEntry[] }>) {
      const { id, duration, data } = action.payload;
      if (!state.stockData[id]) {
        state.stockData[id] = {};
      }
      state.stockData[id][duration] = data;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStocks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStocks.fulfilled, (state, action) => {
        state.stocks = action.payload;
        state.loading = false;
      })
      .addCase(fetchStocks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch stocks';
      })
      .addCase(fetchStockData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStockData.fulfilled, (state, action) => {
        const { id, duration, data } = action.payload;
        if (!state.stockData[id]) {
          state.stockData[id] = {};
        }
        state.stockData[id][duration] = data;
        state.loading = false;
      })
      .addCase(fetchStockData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch stock data';
      });
  },
});

export const { setSelectedStock, setSelectedDuration, setStockData } = stockSlice.actions;

export default stockSlice.reducer;