import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
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
  selectedDuration: string | null;
  stockData: StockDataState;
  loading: boolean;
  error: string | null;
}

// ✅ Initial state
const initialState: StockState = {
  stocks: [],
  selectedStock: null,
  selectedDuration: null,
  stockData: {},
  loading: false,
  error: null,
};

// ✅ Fetch list of stocks
// ✅ Change API URLs to match your backend
export const fetchStocks = createAsyncThunk<Stock[], void>(
  "stocks/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("http://localhost:3000/api/stocks");  // ⬅️ UPDATED URL
      return response.data;
    } catch (error: any) {
      console.error("Error fetching stocks:", error);
      return rejectWithValue(error.response?.data?.message || "Failed to fetch stocks");
    }
  }
);

export const fetchStockData = createAsyncThunk<
  { id: string; duration: string; data: StockEntry[] },
  { id: string; duration: string }
>(
  "stocks/fetchData",
  async ({ id, duration }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`http://localhost:3000/api/stocks/${id}`, { duration });  // ⬅️ UPDATED URL
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
      state.selectedDuration = null;
      state.stockData = {}; // ✅ Clear stock data when switching stocks
    },
    setSelectedDuration: (state, action: PayloadAction<string>) => {
      state.selectedDuration = action.payload;
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
      .addCase(fetchStockData.fulfilled, (state, action) => {
        const { id, duration, data } = action.payload;
        if (!state.stockData[id]) state.stockData[id] = {};
        state.stockData[id][duration] = data.slice(); // ✅ Immutable update
      })
      .addCase(fetchStockData.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { setSelectedStock, setSelectedDuration } = stockSlice.actions;
export default stockSlice.reducer;
