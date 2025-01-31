// backend/index.ts or backend/main/index.ts
import express, { Request, Response } from "express";
import { getAllStockMeta, pollStock } from './main/service';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// GET /api/stocks: List all stocks with metadata
app.get("/api/stocks", (req: Request, res: Response) => {
  const stocks = getAllStockMeta();  // This should return the list of stocks
  res.json(stocks);
});

// POST /api/stocks/:id: Get stock data for the selected stock ID
app.post("/api/stocks/:id", (req: Request, res: Response) => {
  const stockId = req.params.id;
  const { duration } = req.body;
  
  // Ensure that duration and stockId are valid and fetch the corresponding data
  const data = pollStock({ id: stockId, duration });
  res.json(data);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
