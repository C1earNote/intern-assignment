import express, { Request, Response } from "express";
import cors from "cors";
import { getAllStockMeta, pollStock, Status } from "./main/service";

const app = express();
const port = process.env.PORT || 3000;

app.use(cors({
  origin: 'http://localhost:3001',
  credentials: true
}));

app.use(express.json());

app.get("/api/stocks", (req: Request, res: Response) => {
  try {
    const stocks = getAllStockMeta();
    res.json(stocks);
  } catch (error) {
    console.error("Error fetching stocks:", error);
    res.status(500).json({ error: "Failed to fetch stocks" });
  }
});

app.post("/api/stocks/:id", (req: Request, res: Response) => {
  try {
    const stockId = req.params.id;
    const { duration } = req.body;

    if (!stockId || !duration) {
      return res.status(400).json({ error: "Stock ID and duration are required" });
    }

    const result = pollStock({ id: stockId, duration });

    switch (result.status) {
      case Status.COMPLETE:
      case Status.IN_PROGRESS:
        return res.json(result.data);
      
      case Status.ERROR:
        return res.status(404).json({ error: result.message });
      
      case Status.STARTING:
        return res.status(202).json({ message: "Data collection starting" });
      
      default:
        return res.status(500).json({ error: "Unknown status" });
    }
  } catch (error) {
    console.error("Error fetching stock data:", error);
    res.status(500).json({ error: "Failed to fetch stock data" });
  }
});

app.listen(port, () => {
  console.log(`🚀 Server is running on http://localhost:${port}`);
});
