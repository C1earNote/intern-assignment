import aaplNasdaq1Y from './../data/aapl_nasdaq_1y.json';
import aaplNasdaq5Y from './../data/aapl_nasdaq_5y.json';
import msftNasdaq6M from './../data/msft_nasdaq_6m.json';
import msftNasdaq5Y from './../data/msft_nasdaq_5y.json';
import nvdaNasdaq6M from './../data/nvda_nasdaq_6m.json';
import nvdaNasdaq1Y from './../data/nvda_nasdaq_1y.json';
import nvdaNasdaq5Y from './../data/nvda_nasdaq_5y.json';
import cache from '../cache';
import { Server } from "socket.io";

let io: Server; // Store Socket.IO instance

export const setSocketServer = (socketServer: Server) => {
  io = socketServer;
};

export enum Status {
  COMPLETE = "COMPLETE",
  ERROR = "ERROR",
  IN_PROGRESS = "IN_PROGRESS",
  STARTING = "STARTING",
}

interface StockDataPoint {
  price: number;
  change: number;
  change_percent: number;
  volume: number;
}

interface StockDurationData {
  symbol: string;
  type: string;
  price: number;
  previous_close: number;
  change: number;
  change_percent: number;
  pre_or_post_market: number;
  pre_or_post_market_change: number;
  pre_or_post_market_change_percent: number;
  last_update_utc: string;
  time_series: Record<string, StockDataPoint>;
  key_events: any[];
  utc_offset_sec: number;
  interval_sec: number;
  period: string;
}

interface StockData {
  name: string;
  symbol: string;
  available: string[];
  [key: string]: StockDurationData | string[] | string;
}

export type PollResult =
  | { status: Status.COMPLETE; data: Array<StockDataPoint & { timestamp: string }> }
  | { status: Status.ERROR; message: string }
  | { status: Status.IN_PROGRESS; data: Array<StockDataPoint & { timestamp: string }> }
  | { status: Status.STARTING; data: [] };

export const getStocks = (): Record<string, StockData> => ({
  "f47ac10b-58cc-4372-a567-0e02b2c3d479": {
    name: "Apple Inc.",
    symbol: "AAPL:NASDAQ",
    available: ["5y", "1y"],
    "5y": aaplNasdaq5Y as unknown as StockDurationData,
    "1y": aaplNasdaq1Y as unknown as StockDurationData,
  },
  "7c9e6679-7425-40de-944b-e07fc1f90ae7": {
    name: "Microsoft Corporation",
    symbol: "MSFT:NASDAQ",
    available: ["5y", "6m"],
    "5y": msftNasdaq5Y as unknown as StockDurationData,
    "6m": msftNasdaq6M as unknown as StockDurationData,
  },
  "550e8400-e29b-41d4-a716-446655440000": {
    name: "NVIDIA Corporation",
    symbol: "NVDA:NASDAQ",
    available: ["5y", "1y", "6m"],
    "5y": nvdaNasdaq5Y as unknown as StockDurationData,
    "1y": nvdaNasdaq1Y as unknown as StockDurationData,
    "6m": nvdaNasdaq6M as unknown as StockDurationData,
  },
});

export const getAllStockMeta = () => {
  const mapping = getStocks();
  return Object.keys(mapping).map((key) => ({
    id: key,
    name: mapping[key].name,
    symbol: mapping[key].symbol,
    available: mapping[key].available,
  }));
};

export const pollStock = ({ id, duration }: { id: string; duration: string }): PollResult => {
  const mapping = getStocks();
  const stock = mapping[id];

  if (!stock) return { status: Status.ERROR, message: "Stock not found" };

  const durationKey = duration.toLowerCase();
  const durationData = stock[durationKey] as StockDurationData;

  if (!durationData?.time_series) return { status: Status.ERROR, message: "Data not available" };

  const dataPoints = Object.entries(durationData.time_series).map(([timestamp, data]) => ({
    timestamp,
    ...data,
  }));

  // Emit real-time stock updates via WebSocket
  if (io) {
    io.emit("stockUpdate", { stockId: id, duration, data: dataPoints });
  }

  return { status: Status.COMPLETE, data: dataPoints };
};

function isValidCacheEntry(obj: unknown): obj is {
  timestamp: number;
  pollingTime: number;
  numberOfPartitions: number;
  symbol: string;
  duration: string;
} {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "timestamp" in obj &&
    "pollingTime" in obj &&
    "numberOfPartitions" in obj &&
    "symbol" in obj &&
    "duration" in obj
  );
}

export const generatePollingData = ({
  data,
  duration,
}: {
  data: StockData;
  duration: string;
}) => {
  const durationData = data[duration] as StockDurationData;
  const key = `${data.symbol}-${duration}`.toLowerCase();
  const cached = cache.get(key);

  const graphData = durationData.time_series;
  const fullDataLength = Object.keys(graphData).length;

  if (cached && isValidCacheEntry(cached)) {
    const { numberOfPartitions, pollingTime, timestamp } = cached;
    const currentTimeStamp = Date.now();
    const timeElapsed = (currentTimeStamp - timestamp) / 1000;

    if (timeElapsed > pollingTime) {
      return {
        data: howMuchDataToReturn(graphData, fullDataLength),
        status: Status.COMPLETE,
      };
    }

    const timeElapsedInPercent = timeElapsed / pollingTime;
    if (timeElapsedInPercent > 0) {
      const newIndex = Math.floor(timeElapsedInPercent * fullDataLength);
      return {
        data: howMuchDataToReturn(graphData, newIndex),
        status: Status.IN_PROGRESS,
      };
    }
  }

  const timestamp = Date.now();
  const pollingTime = Math.floor(Math.random() * 60) + 45;
  const numberOfPartitions = Math.ceil(fullDataLength / pollingTime);

  cache.set(key, {
    symbol: data.symbol,
    duration,
    timestamp,
    pollingTime,
    numberOfPartitions,
  });

  return { status: Status.STARTING, data: [] };
};

const howMuchDataToReturn = (
  timeSeries: Record<string, StockDataPoint>,
  lastIndex: number
): Array<StockDataPoint & { timestamp: string }> => {
  return Object.entries(timeSeries)
    .slice(0, lastIndex)
    .map(([timestamp, data]) => ({ timestamp, ...data }));
};