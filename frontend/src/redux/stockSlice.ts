import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Define StockEntry type
interface StockEntry {
  timestamp: string;
  price: number;
}

// Define Stock type for each stock in the state
interface Stock {
  id: string;
  name: string;
  symbol: string;
  available: string[];
}

// Define the structure of stock data in the state
interface StockDataState {
  [key: string]: {
    [key: string]: StockEntry[];  // key is stock ID, value is a map of duration to stock data
  };
}

// Define the shape of the Redux state
interface StockState {
  stocks: Stock[];
  selectedStock: Stock | null;
  stockData: StockDataState;
  loading: boolean;
  error: string | null;
}

// Fetch all stocks
export const fetchStocks = createAsyncThunk<Stock[], void>(
  "stocks/fetchAll",
  async () => {
    const response = await axios.get("/api/stocks");
    return response.data;
  }
);

// Fetch stock data over time
export const fetchStockData = createAsyncThunk<
  { id: string; duration: string; data: StockEntry[] },
  { id: string; duration: string }
>(
  "stocks/fetchData",
  async ({ id, duration }) => {
    const response = await axios.post(`/api/stocks/${id}`, { duration });
    return { id, duration, data: response.data };
  }
);

const initialState: StockState = {
  stocks: [],
  selectedStock: null,
  stockData: {},
  loading: false,
  error: null,
};

const stockSlice = createSlice({
  name: "stocks",
  initialState,
  reducers: {
    setSelectedStock: (state, action) => {
      state.selectedStock = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStocks.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchStocks.fulfilled, (state, action) => {
        state.loading = false;
        state.stocks = action.payload;
      })
      .addCase(fetchStocks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch stocks";
      })
      .addCase(fetchStockData.fulfilled, (state, action) => {
        const { id, duration, data } = action.payload;
        if (!state.stockData[id]) state.stockData[id] = {};
        state.stockData[id][duration] = data;
      })
      .addCase(fetchStockData.rejected, (state, action) => {
        state.error = action.error.message || "Failed to fetch stock data";
      });
  },
});

export const { setSelectedStock } = stockSlice.actions;
export default stockSlice.reducer;
