import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

// Define StockEntry type
export interface StockEntry {
  timestamp: string;
  price: number;
}

// Define Stock type for each stock in the state
interface Stock {
  id: string;
  name: string;
  symbol: string;
  available: string[]; // Available durations (e.g., ["1D", "1W", "1M", "1Y"])
}

// Define the structure of stock data in the state
interface StockDataState {
  [stockId: string]: {
    [duration: string]: StockEntry[];
  };
}

// Define the Redux state shape
interface StockState {
  stocks: Stock[];
  selectedStock: Stock | null;
  selectedDuration: string; // Ensure it's always a string
  stockData: StockDataState;
  loading: boolean;
  error: string | null;
}

// ✅ Initial state
const initialState: StockState = {
  stocks: [],
  selectedStock: null,
  selectedDuration: "all", // Default to "all"
  stockData: {},
  loading: false,
  error: null,
};

// ✅ Fetch list of stocks
export const fetchStocks = createAsyncThunk<Stock[], void>(
  "stocks/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("http://localhost:3000/api/stocks");
      return response.data;
    } catch (error: any) {
      console.error("Error fetching stocks:", error);
      return rejectWithValue(error.response?.data?.message || "Failed to fetch stocks");
    }
  }
);

// ✅ Fetch stock data (for a specific duration)
export const fetchStockData = createAsyncThunk<
  { id: string; duration: string; data: StockEntry[] },
  { id: string; duration: string }
>(
  "stocks/fetchData",
  async ({ id, duration }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`http://localhost:3000/api/stocks/${id}`, { duration });
      return { id, duration, data: response.data };
    } catch (error: any) {
      console.error("Error fetching stock data:", error);
      return rejectWithValue(error.response?.data?.message || "Failed to fetch stock data");
    }
  }
);

// ✅ Redux slice
const stockSlice = createSlice({
  name: "stocks",
  initialState,
  reducers: {
    setSelectedStock: (state, action: PayloadAction<Stock | null>) => {
      state.selectedStock = action.payload;
      state.selectedDuration = "all"; // ✅ Reset to "all" when switching stocks
      state.stockData = {}; // ✅ Clear stock data when switching stocks
    },
    setSelectedDuration: (state, action: PayloadAction<string>) => {
      state.selectedDuration = action.payload || "all"; // ✅ Ensure it's always a string
    },
    clearStockData: (state, action: PayloadAction<{ id: string }>) => {
      delete state.stockData[action.payload.id]; // ✅ Properly remove stock data
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStocks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStocks.fulfilled, (state, action) => {
        state.loading = false;
        state.stocks = action.payload.slice(); // ✅ Immutable update
      })
      .addCase(fetchStocks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchStockData.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchStockData.fulfilled, (state, action) => {
        const { id, duration, data } = action.payload;
      
        console.log(`Redux updated: ${id} - ${duration}`, data); // ✅ Debugging log
      
        state.stockData[id] = { [duration]: data.slice() }; // ✅ Store only selected duration
        state.loading = false;
      })      
      .addCase(fetchStockData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setSelectedStock, setSelectedDuration, clearStockData } = stockSlice.actions;
export default stockSlice.reducer;
