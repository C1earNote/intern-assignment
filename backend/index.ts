import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import { getStockData } from './service';

// Initialize the express app
const app = express();
const port = 5000;
/////uayuay
// Middleware to handle JSON requests
app.use(express.json());

// Serve static files (e.g., images, CSS, JS files) if needed
app.use(express.static(path.join(__dirname, 'public')));

// API endpoint to fetch stock data
app.get('/api/stock/:symbol', (req: Request, res: Response, next: NextFunction) => {
  const { symbol } = req.params;
  try {
    const data = getStockData(symbol);
    if (data) {
      res.json(data); // Send the stock data as a JSON response
    } else {
      res.status(404).json({ message: 'Stock data not found' }); // Handle 404 if stock data is not found
    }
  } catch (error) {
    next(error); // Pass error to the error handler middleware
  }
});

// Default route (for testing)
app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to the stock API!');
});

// Error handling middleware (to catch unexpected errors)
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Start the server
app.listen(port, () => {
  console.log(`Backend server is running at http://localhost:${port}`);
});

