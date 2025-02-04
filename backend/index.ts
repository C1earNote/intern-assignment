import express, { Request, Response } from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import { getAllStockMeta, pollStock, Status, setSocketServer } from "./main/service";

const app = express();
const port = process.env.PORT || 3000;

// Create an HTTP server and attach Socket.IO
const server = createServer(app);
const io = new Server(server, {
  cors: { origin: "http://localhost:3001", credentials: true },
});

setSocketServer(io);

app.use(cors({ origin: "http://localhost:3001", credentials: true }));
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

    // Emit real-time data to connected clients
    if (result.status === Status.COMPLETE) {
      io.emit("stockUpdate", { stockId, duration, data: result.data });
      return res.json(result.data);
    } else if (result.status === Status.IN_PROGRESS) {
      return res.json(result.data);
    } else if (result.status === Status.STARTING) {
      return res.json(result.data);
    } else if (result.status === Status.ERROR) {
      return res.status(400).json({ error: result.message });
    }
  } catch (error) {
    console.error("Error fetching stock data:", error);
    res.status(500).json({ error: "Failed to fetch stock data" });
  }
});

// WebSocket connection handling
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

server.listen(port, () => {
  console.log(`🚀 Server is running on http://localhost:${port}`);
});