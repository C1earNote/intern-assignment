## The challenge 🧑🏽‍💻
There are 2 APIs in this repo you can run locally (instructions below).  
1. `GET /api/stocks`: list of stocks with durations for which data is available 
2. `POST /api/stocks/:id`: graph data for a specific stock

The second API simulates real-life data systems where data processing happens over time in the backend - meaning, it may require _multiple_ requests from the frontend to gather complete information.   
Eg.
- Request 1: responds with `{0 entries}`
- Request 2 after a little while: responds with `{some entries}`
- Request 3 after a little more while: responds with `{some more entries}`
- Request n after a little more little while: responds with `{all entries}`

### What we want to see (mandatory)
- A dropdown where the user can select a stock
- A way to switch between durations for the selected stock
- A graph for the selected stock and duration (remember the second API returns data over time - this graph should be updated dynamically)
- Make it responsive and look good!

### Tech constraints (mandatory)
- Use Redux Toolkit for managing global state, thunk for API calls
- Don't drill props beyond level 2
- Use pre-built components and libraries (we use MUI and react-chartjs, but you are free to use any lib of your choice)

### Brownie points (optional),
- if you can show multiple graphs at the same time
- if you can host it and share a link
- if you can add login with a basic 2FA implementation (we use Firebase!)

## Running services
### Instructions to run the UI
```bash
cd frontend
yarn start
```
### Add a demonstration video 
https://youtu.be/4J_B9iab9U4

### Instructions to run the backend API
```bash
cd backend
yarn dev
```
or
```bash
cd backend 
yarn start
```
