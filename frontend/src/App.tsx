import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchStocks } from "./redux/stockSlice";
import StockSelector from "./components/StockSelector";
import StockChart from "./components/StockChart";
import { AppDispatch } from "./redux/store";  // ✅ Import correct type

function App() {
  const dispatch = useDispatch<AppDispatch>();  // ✅ Use correct type

  useEffect(() => {
    dispatch(fetchStocks());
  }, [dispatch]);

  return (
    <div>
      <h1>Stock Visualization</h1>
      <StockSelector />
      <StockChart />
    </div>
  );
}

export default App;