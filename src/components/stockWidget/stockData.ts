export type StockData = {
  ticker: string;
  company: string;
  price: number;
  changePercent: number;
  open: number;
  high: number;
  low: number;
  volume: string;
  marketCap: string;
  peRatio: number;
  weekHigh52: number;
  weekLow52: number;
  avgVolume: string;
  dividend: string;
  earningsDate: string;
};

export const STOCKS: Record<string, StockData> = {
  AAPL: {
    ticker: 'AAPL',
    company: 'Apple Inc.',
    price: 189.42,
    changePercent: 2.34,
    open: 189.01,
    high: 191.23,
    low: 187.45,
    volume: '48.2M',
    marketCap: '2.94T',
    peRatio: 29.8,
    weekHigh52: 199.62,
    weekLow52: 143.90,
    avgVolume: '55.1M',
    dividend: '0.96 (0.51%)',
    earningsDate: 'Jul 31, 2026',
  },
  GOOGL: {
    ticker: 'GOOGL',
    company: 'Alphabet Inc.',
    price: 141.80,
    changePercent: -0.58,
    open: 142.50,
    high: 143.10,
    low: 140.90,
    volume: '22.1M',
    marketCap: '1.78T',
    peRatio: 24.1,
    weekHigh52: 153.78,
    weekLow52: 115.35,
    avgVolume: '25.3M',
    dividend: '--',
    earningsDate: 'Jul 22, 2026',
  },
  TSLA: {
    ticker: 'TSLA',
    company: 'Tesla Inc.',
    price: 248.50,
    changePercent: 4.12,
    open: 240.10,
    high: 250.80,
    low: 239.50,
    volume: '112.5M',
    marketCap: '790.2B',
    peRatio: 62.5,
    weekHigh52: 299.29,
    weekLow52: 152.37,
    avgVolume: '98.7M',
    dividend: '--',
    earningsDate: 'Jul 17, 2026',
  },
};

export const CHART_POINTS = [30, 45, 38, 55, 50, 62, 58, 70, 65, 72, 68, 75];
