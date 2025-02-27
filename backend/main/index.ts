import { Router } from 'express';
import { getAllStockMeta, getStocks, pollStock } from './service';

const router: Router = Router();

router.get('/', (req, res) => {
  res.json({ message: 'Welcome to the alloan.ai API!' });
});

router.get('/stocks', (req, res) => {
  const response = getAllStockMeta();
  res.json(response);
});

router.post('/stocks/:id', (req, res) => {
  const id = req.params.id;
  const body = req.body;

  console.log("Request Body:", body);

  if (!body.duration) {
    return res.status(400).json({ message: 'Duration is required' });
  }

  const reqBody = {
    id,
    duration: body.duration.toLowerCase(),
  };

  const response = pollStock(reqBody);

  console.log("Response Sent:", response);

  res.json(response);
});



export default router;