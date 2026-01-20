
export interface Trade {
  time: string;
  position: string;
  symbol: string;
  type: 'buy' | 'sell';
  volume: number;
  entryPrice: number;
  exitPrice: number;
  exitTime: string;
  commission: number;
  swap: number;
  profit: number;
  durationMinutes: number;
}

export interface Deal {
  time: string;
  dealId: string;
  symbol: string;
  type: string;
  direction: string;
  volume: number;
  price: number;
  profit: number;
  balance: number;
  comment: string;
}

export interface ReportSummary {
  name: string;
  account: string;
  company: string;
  totalNetProfit: number;
  grossProfit: number;
  grossLoss: number;
  profitFactor: number;
  winRate: number;
  totalTrades: number;
  maxDrawdown: number;
  initialDeposit: number;
  finalBalance: number;
}

export interface ChartDataPoint {
  time: string;
  balance: number;
  profit: number;
  timestamp: number;
}
