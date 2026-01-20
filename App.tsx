
import React, { useState, useEffect, useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, 
  Cell, PieChart, Pie, Legend 
} from 'recharts';
import { 
  TrendingUp, TrendingDown, DollarSign, Target, Activity, Clock, 
  ChevronRight, ArrowUpRight, ArrowDownRight, LayoutDashboard, List, PieChart as PieChartIcon
} from 'lucide-react';
import { parseTradeHistory } from './utils/parser';
import { Trade, Deal, ReportSummary, ChartDataPoint } from './types';

// Hardcoded data based on the provided file snippet for initial load
const RAW_CSV = `Trade History Report,,,,,,,,,,,,,
Name:,,,Eslam Khaled Abou Elmaata Mahmoud Gomaa,,,,,,,,,,
Account:,,,"52603751 (USD, ICMarketsSC-Demo, demo, Hedge)",,,,,,,,,,
Company:,,,Raw Trading Ltd,,,,,,,,,,
Date:,,,2025.12.14 05:04,,,,,,,,,,
Positions,,,,,,,,,,,,,
Time,Position,Symbol,Type,Volume,Price,S / L,T / P,Time,Price,Commission,Swap,Profit,
2025.11.14 03:42:08,1318122305,XAUUSD,buy,0.01,4 182.78,,,2025.11.14 03:50:12,4 186.14,- 0.08,0.00, 3.36,
2025.11.14 03:42:10,1318122340,XAUUSD,buy,0.01,4 182.94,,,2025.11.14 03:50:12,4 186.14,- 0.08,0.00, 3.20,
2025.11.14 03:42:11,1318122354,XAUUSD,buy,0.01,4 183.01,,,2025.11.14 03:50:12,4 186.14,- 0.08,0.00, 3.13,
2025.11.14 03:42:11,1318122362,XAUUSD,buy,0.01,4 182.95,,,2025.11.14 03:50:12,4 186.14,- 0.08,0.00, 3.19,
2025.11.14 03:42:12,1318122368,XAUUSD,buy,0.01,4 182.97,,,2025.11.14 03:50:12,4 186.14,- 0.08,0.00, 3.17,
2025.11.14 03:42:13,1318122377,XAUUSD,buy,0.01,4 182.88,,,2025.11.14 03:50:12,4 186.14,- 0.08,0.00, 3.26,
2025.11.14 03:42:14,1318122402,XAUUSD,buy,0.01,4 182.88,,,2025.11.14 03:50:12,4 186.14,- 0.08,0.00, 3.26,
2025.11.14 03:42:14,1318122405,XAUUSD,buy,0.01,4 182.96,,,2025.11.14 03:50:12,4 186.14,- 0.08,0.00, 3.18,
2025.11.14 03:42:15,1318122442,XAUUSD,buy,0.01,4 182.88,,,2025.11.14 03:50:12,4 186.14,- 0.08,0.00, 3.26,
2025.11.14 03:42:16,1318122458,XAUUSD,buy,0.01,4 182.75,,,2025.11.14 03:50:12,4 186.14,- 0.08,0.00, 3.39,
2025.11.14 03:42:17,1318122464,XAUUSD,buy,0.01,4 182.79,,,2025.11.14 03:50:12,4 186.14,- 0.08,0.00, 3.35,
2025.11.14 03:42:18,1318122477,XAUUSD,buy,0.01,4 182.83,,,2025.11.14 03:50:12,4 186.14,- 0.08,0.00, 3.31,
2025.11.14 03:42:18,1318122493,XAUUSD,buy,0.01,4 182.90,,,2025.11.14 03:50:12,4 186.14,- 0.08,0.00, 3.24,
2025.11.14 03:42:19,1318122505,XAUUSD,buy,0.01,4 182.91,,,2025.11.14 03:50:12,4 186.14,- 0.08,0.00, 3.23,
2025.11.14 03:42:20,1318122514,XAUUSD,buy,0.01,4 182.91,,,2025.11.14 03:50:12,4 186.14,- 0.08,0.00, 3.23,
2025.11.14 03:42:22,1318122540,XAUUSD,buy,0.01,4 182.39,,,2025.11.14 03:50:12,4 186.14,- 0.08,0.00, 3.75,
2025.11.14 03:42:24,1318122550,XAUUSD,buy,0.01,4 182.37,,,2025.11.14 03:50:12,4 186.14,- 0.08,0.00, 3.77,
2025.11.14 03:42:25,1318122555,XAUUSD,buy,0.01,4 182.36,,,2025.11.14 03:50:12,4 186.14,- 0.08,0.00, 3.78,
2025.11.14 03:42:26,1318122561,XAUUSD,buy,0.01,4 182.32,,,2025.11.14 03:50:12,4 186.14,- 0.08,0.00, 3.82,
2025.11.14 03:42:26,1318122565,XAUUSD,buy,0.01,4 182.09,,,2025.11.14 03:50:12,4 186.14,- 0.08,0.00, 4.05,
2025.11.14 03:42:27,1318122572,XAUUSD,buy,0.01,4 182.12,,,2025.11.14 03:50:12,4 186.14,- 0.08,0.00, 4.02,
2025.11.14 03:42:28,1318122574,XAUUSD,buy,0.01,4 182.09,,,2025.11.14 03:50:12,4 186.14,- 0.08,0.00, 4.05,
2025.11.14 03:42:29,1318122581,XAUUSD,buy,0.01,4 182.52,,,2025.11.14 03:50:12,4 186.14,- 0.08,0.00, 3.62,
2025.11.14 03:42:30,1318122586,XAUUSD,buy,0.01,4 182.35,,,2025.11.14 03:50:12,4 186.14,- 0.08,0.00, 3.79,
2025.11.14 03:42:31,1318122594,XAUUSD,buy,0.01,4 182.51,,,2025.11.14 03:50:12,4 186.14,- 0.08,0.00, 3.63,
2025.11.14 03:42:31,1318122598,XAUUSD,buy,0.01,4 182.42,,,2025.11.14 03:50:12,4 186.14,- 0.08,0.00, 3.72,
2025.11.14 03:42:32,1318122602,XAUUSD,buy,0.01,4 182.20,,,2025.11.14 03:50:12,4 186.14,- 0.08,0.00, 3.94,
2025.11.14 03:42:33,1318122610,XAUUSD,buy,0.01,4 181.84,,,2025.11.14 03:50:12,4 186.14,- 0.08,0.00, 4.30,
2025.11.14 03:42:34,1318122635,XAUUSD,buy,0.01,4 181.67,,,2025.11.14 03:50:12,4 186.14,- 0.08,0.00, 4.47,
2025.11.14 03:52:02,1318134248,XAUUSD,sell,0.29,4 187.27,,,2025.11.14 03:55:07,4 191.54,- 2.04,0.00,- 123.83,
2025.11.14 03:55:10,1318139806,XAUUSD,buy,0.29,4 191.97,,4 201.39,2025.11.14 04:23:45,4 198.70,- 2.04,0.00, 195.17,
2025.11.14 04:27:29,1318172734,XAUUSD,sell,0.29,4 201.93,4 212.93,4 142.96,2025.11.14 13:17:12,4 142.81,- 2.04,0.00,1 714.48,
Deals,,,,,,,,,,,,,
Time,Deal,Symbol,Type,Direction,Volume,Price,Order,Commission,Fee,Swap,Profit,Balance,Comment
2025.11.14 03:35:29,1077567737,,balance,,,,,0.00,0.00,0.00,5 000.00,5 000.00,Demo deposit
2025.11.14 03:42:08,1077574505,XAUUSD,buy,in,0.01,4 182.78,1318122305,- 0.04,0.00,0.00,0.00,4 999.96,
2025.11.14 03:42:10,1077574545,XAUUSD,buy,in,0.01,4 182.94,1318122340,- 0.04,0.00,0.00,0.00,4 999.92,
2025.11.14 03:42:11,1077574559,XAUUSD,buy,in,0.01,4 183.01,1318122354,- 0.04,0.00,0.00,0.00,4 999.88,
2025.11.14 03:42:11,1077574566,XAUUSD,buy,in,0.01,4 182.95,1318122362,- 0.04,0.00,0.00,0.00,4 999.84,
2025.11.14 03:42:12,1077574574,XAUUSD,buy,in,0.01,4 182.97,1318122368,- 0.04,0.00,0.00,0.00,4 999.80,
2025.11.14 03:42:13,1077574584,XAUUSD,buy,in,0.01,4 182.88,1318122377,- 0.04,0.00,0.00,0.00,4 999.76,
2025.11.14 03:42:14,1077574607,XAUUSD,buy,in,0.01,4 182.88,1318122402,- 0.04,0.00,0.00,0.00,4 999.72,
2025.11.14 03:42:14,1077574609,XAUUSD,buy,in,0.01,4 182.96,1318122405,- 0.04,0.00,0.00,0.00,4 999.68,
2025.11.14 03:42:15,1077574644,XAUUSD,buy,in,0.01,4 182.88,1318122442,- 0.04,0.00,0.00,0.00,4 999.64,
2025.11.14 03:42:16,1077574661,XAUUSD,buy,in,0.01,4 182.75,1318122458,- 0.04,0.00,0.00,0.00,4 999.60,
2025.11.14 03:42:17,1077574665,XAUUSD,buy,in,0.01,4 182.79,1318122464,- 0.04,0.00,0.00,0.00,4 999.56,
2025.11.14 03:42:18,1077574674,XAUUSD,buy,in,0.01,4 182.83,1318122477,- 0.04,0.00,0.00,0.00,4 999.52,
2025.11.14 03:42:18,1077574691,XAUUSD,buy,in,0.01,4 182.90,1318122493,- 0.04,0.00,0.00,0.00,4 999.48,
2025.11.14 03:42:19,1077574701,XAUUSD,buy,in,0.01,4 182.91,1318122505,- 0.04,0.00,0.00,0.00,4 999.44,
2025.11.14 03:42:20,1077574709,XAUUSD,buy,in,0.01,4 182.91,1318122514,- 0.04,0.00,0.00,0.00,4 999.40,
2025.11.14 03:42:22,1077574733,XAUUSD,buy,in,0.01,4 182.39,1318122540,- 0.04,0.00,0.00,0.00,4 999.36,
2025.11.14 03:42:24,1077574740,XAUUSD,buy,in,0.01,4 182.37,1318122550,- 0.04,0.00,0.00,0.00,4 999.32,
2025.11.14 03:42:25,1077574744,XAUUSD,buy,in,0.01,4 182.36,1318122555,- 0.04,0.00,0.00,0.00,4 999.28,
2025.11.14 03:42:26,1077574750,XAUUSD,buy,in,0.01,4 182.32,1318122561,- 0.04,0.00,0.00,0.00,4 999.24,
2025.11.14 03:42:26,1077574754,XAUUSD,buy,in,0.01,4 182.09,1318122565,- 0.04,0.00,0.00,0.00,4 999.20,
2025.11.14 03:42:27,1077574760,XAUUSD,buy,in,0.01,4 182.12,1318122572,- 0.04,0.00,0.00,0.00,4 999.16,
2025.11.14 03:42:28,1077574762,XAUUSD,buy,in,0.01,4 182.09,1318122574,- 0.04,0.00,0.00,0.00,4 999.12,
2025.11.14 03:42:29,1077574768,XAUUSD,buy,in,0.01,4 182.52,1318122581,- 0.04,0.00,0.00,0.00,4 999.08,
2025.11.14 03:42:30,1077574772,XAUUSD,buy,in,0.01,4 182.35,1318122586,- 0.04,0.00,0.00,0.00,4 999.04,
2025.11.14 03:42:31,1077574779,XAUUSD,buy,in,0.01,4 182.51,1318122594,- 0.04,0.00,0.00,0.00,4 999.00,
2025.11.14 03:42:31,1077574782,XAUUSD,buy,in,0.01,4 182.42,1318122598,- 0.04,0.00,0.00,0.00,4 998.96,
2025.11.14 03:42:32,1077574786,XAUUSD,buy,in,0.01,4 182.20,1318122602,- 0.04,0.00,0.00,0.00,4 998.92,
2025.11.14 03:42:33,1077574794,XAUUSD,buy,in,0.01,4 181.84,1318122610,- 0.04,0.00,0.00,0.00,4 998.88,
2025.11.14 03:42:34,1077574820,XAUUSD,buy,in,0.01,4 181.67,1318122635,- 0.04,0.00,0.00,0.00,4 998.84,
2025.11.14 03:50:12,1077583564,XAUUSD,sell,out,0.01,4 186.14,1318132184,- 0.04,0.00,0.00, 3.36,5 002.16,
2025.11.14 03:50:12,1077583565,XAUUSD,sell,out,0.01,4 186.14,1318132185,- 0.04,0.00,0.00, 3.20,5 005.32,
2025.11.14 03:50:12,1077583566,XAUUSD,sell,out,0.01,4 186.14,1318132186,- 0.04,0.00,0.00, 3.13,5 008.41,
2025.11.14 03:50:12,1077583567,XAUUSD,sell,out,0.01,4 186.14,1318132187,- 0.04,0.00,0.00, 3.19,5 011.56,
2025.11.14 03:50:12,1077583568,XAUUSD,sell,out,0.01,4 186.14,1318132188,- 0.04,0.00,0.00, 3.17,5 014.69,
2025.11.14 03:50:12,1077583569,XAUUSD,sell,out,0.01,4 186.14,1318132189,- 0.04,0.00,0.00, 3.26,5 017.91,
2025.11.14 03:50:12,1077583570,XAUUSD,sell,out,0.01,4 186.14,1318132190,- 0.04,0.00,0.00, 3.26,5 021.13,
2025.11.14 03:50:12,1077583571,XAUUSD,sell,out,0.01,4 186.14,1318132192,- 0.04,0.00,0.00, 3.18,5 024.27,
2025.11.14 03:50:12,1077583572,XAUUSD,sell,out,0.01,4 186.14,1318132193,- 0.04,0.00,0.00, 3.26,5 027.49,
2025.11.14 03:50:12,1077583573,XAUUSD,sell,out,0.01,4 186.14,1318132194,- 0.04,0.00,0.00, 3.39,5 030.84,
2025.11.14 03:50:12,1077583574,XAUUSD,sell,out,0.01,4 186.14,1318132195,- 0.04,0.00,0.00, 3.35,5 034.15,
2025.11.14 03:50:12,1077583575,XAUUSD,sell,out,0.01,4 186.14,1318132196,- 0.04,0.00,0.00, 3.31,5 037.42,
2025.11.14 03:50:12,1077583576,XAUUSD,sell,out,0.01,4 186.14,1318132197,- 0.04,0.00,0.00, 3.24,5 040.62,
2025.11.14 03:50:12,1077583577,XAUUSD,sell,out,0.01,4 186.14,1318132198,- 0.04,0.00,0.00, 3.23,5 043.81,
2025.11.14 03:50:12,1077583578,XAUUSD,sell,out,0.01,4 186.14,1318132199,- 0.04,0.00,0.00, 3.23,5 047.00,
2025.11.14 03:50:12,1077583579,XAUUSD,sell,out,0.01,4 186.14,1318132200,- 0.04,0.00,0.00, 3.75,5 050.71,
2025.11.14 03:50:12,1077583580,XAUUSD,sell,out,0.01,4 186.14,1318132201,- 0.04,0.00,0.00, 3.77,5 054.44,
2025.11.14 03:50:12,1077583581,XAUUSD,sell,out,0.01,4 186.14,1318132202,- 0.04,0.00,0.00, 3.78,5 058.18,
2025.11.14 03:50:12,1077583582,XAUUSD,sell,out,0.01,4 186.14,1318132203,- 0.04,0.00,0.00, 3.82,5 061.96,
2025.11.14 03:50:12,1077583583,XAUUSD,sell,out,0.01,4 186.14,1318132204,- 0.04,0.00,0.00, 4.05,5 065.97,
2025.11.14 03:50:12,1077583584,XAUUSD,sell,out,0.01,4 186.14,1318132205,- 0.04,0.00,0.00, 4.02,5 069.95,
2025.11.14 03:50:12,1077583585,XAUUSD,sell,out,0.01,4 186.14,1318132206,- 0.04,0.00,0.00, 4.05,5 073.96,
2025.11.14 03:50:12,1077583586,XAUUSD,sell,out,0.01,4 186.14,1318132207,- 0.04,0.00,0.00, 3.62,5 077.54,
2025.11.14 03:50:12,1077583587,XAUUSD,sell,out,0.01,4 186.14,1318132208,- 0.04,0.00,0.00, 3.79,5 0812.9,
2025.11.14 03:50:12,1077583588,XAUUSD,sell,out,0.01,4 186.14,1318132209,- 0.04,0.00,0.00, 3.63,5 084.88,
2025.11.14 03:50:12,1077583589,XAUUSD,sell,out,0.01,4 186.14,1318132210,- 0.04,0.00,0.00, 3.72,5 088.56,
2025.11.14 03:50:12,1077583590,XAUUSD,sell,out,0.01,4 186.14,1318132211,- 0.04,0.00,0.00, 3.94,5 092.46,
2025.11.14 03:50:12,1077583591,XAUUSD,sell,out,0.01,4 186.14,1318132212,- 0.04,0.00,0.00, 4.30,5 096.72,
2025.11.14 03:50:12,1077583592,XAUUSD,sell,out,0.01,4 186.14,1318132213,- 0.04,0.00,0.00, 4.47,5 101.15,
2025.11.14 03:52:02,1077585312,XAUUSD,sell,in,0.29,4 187.27,1318134248,- 1.02,0.00,0.00,0.00,5 100.13,
2025.11.14 03:55:07,1077590587,XAUUSD,buy,out,0.29,4 191.54,1318139767,- 1.02,0.00,0.00,- 123.83,4 975.28,
2025.11.14 03:55:10,1077590617,XAUUSD,buy,in,0.29,4 191.97,1318139806,- 1.02,0.00,0.00,0.00,4 974.26,
2025.11.14 04:23:45,1077619363,XAUUSD,sell,out,0.29,4 198.70,1318172602,- 1.02,0.00,0.00, 195.17,5 168.41,
2025.11.14 04:27:29,1077623875,XAUUSD,sell,in,0.29,4 201.93,1318172734,- 1.02,0.00,0.00,0.00,5 167.39,
2025.11.14 13:17:12,1078237063,XAUUSD,buy,out,0.29,4 142.81,1318862738,- 1.02,0.00,0.00,1 714.48,6 880.85,[tp 4142.96]
Results,,,,,,,,,,,,,
Total Net Profit:,,,1 880.85,Gross Profit:,,,2 009.92,Gross Loss:,,,- 129.07,,
Profit Factor:,,, 15.57,Expected Payoff:,,, 58.78,,,,,,
Recovery Factor:,,, 14.82,Sharpe Ratio:,,, 0.20,,,,,,
Total Trades:,,, 32,Short Trades (won %):,,,2 (50.00%),Long Trades (won %):,,,30 (1000.00%),,
Profit Trades (% of total):,,,31 (96.88%),Loss Trades (% of total):,,,1 (3.12%),,
`;

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'trades' | 'distribution'>('dashboard');
  const [data, setData] = useState<{ trades: Trade[], deals: Deal[], summary: ReportSummary } | null>(null);

  useEffect(() => {
    // Simulating parsing initial file
    const result = parseTradeHistory(RAW_CSV);
    setData(result);
  }, []);

  const chartData: ChartDataPoint[] = useMemo(() => {
    if (!data) return [];
    return data.deals
      .filter(d => d.balance !== 0)
      .map(d => ({
        time: d.time.split(' ')[0],
        timestamp: new Date(d.time.replace(/\./g, '/')).getTime(),
        balance: d.balance,
        profit: d.profit
      }));
  }, [data]);

  const stats = useMemo(() => {
    if (!data) return null;
    const wins = data.trades.filter(t => t.profit > 0).length;
    return {
      totalNetProfit: data.summary.totalNetProfit,
      winRate: (wins / data.trades.length) * 100,
      totalTrades: data.trades.length,
      avgProfit: data.trades.reduce((acc, curr) => acc + curr.profit, 0) / data.trades.length,
      maxWin: Math.max(...data.trades.map(t => t.profit)),
      maxLoss: Math.min(...data.trades.map(t => t.profit)),
      equity: data.summary.finalBalance,
      growth: ((data.summary.finalBalance - data.summary.initialDeposit) / data.summary.initialDeposit) * 100
    };
  }, [data]);

  const distributionData = useMemo(() => {
    if (!data) return [];
    const symbols: { [key: string]: number } = {};
    data.trades.forEach(t => {
      symbols[t.symbol] = (symbols[t.symbol] || 0) + 1;
    });
    return Object.entries(symbols).map(([name, value]) => ({ name, value }));
  }, [data]);

  const COLORS = ['#10b981', '#ef4444', '#3b82f6', '#f59e0b', '#8b5cf6'];

  if (!data || !stats) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-4">
          <Activity className="animate-spin text-emerald-500" size={48} />
          <p className="text-xl font-medium tracking-wide">Processing Trade Intelligence...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      {/* Sidebar / Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-500 p-2 rounded-lg">
            <TrendingUp className="text-slate-950" size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white leading-none">TradeInsight Pro</h1>
            <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest">{data.summary.account}</p>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-2 bg-slate-800/50 p-1 rounded-xl">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${activeTab === 'dashboard' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20' : 'hover:bg-slate-800 text-slate-400'}`}
          >
            <LayoutDashboard size={18} />
            <span className="text-sm font-medium">Dashboard</span>
          </button>
          <button 
            onClick={() => setActiveTab('trades')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${activeTab === 'trades' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20' : 'hover:bg-slate-800 text-slate-400'}`}
          >
            <List size={18} />
            <span className="text-sm font-medium">Trade History</span>
          </button>
          <button 
            onClick={() => setActiveTab('distribution')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${activeTab === 'distribution' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20' : 'hover:bg-slate-800 text-slate-400'}`}
          >
            <PieChartIcon size={18} />
            <span className="text-sm font-medium">Analytics</span>
          </button>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden lg:block text-right">
            <p className="text-xs text-slate-500 leading-none">Account Holder</p>
            <p className="text-sm font-semibold text-slate-200">{data.summary.name}</p>
          </div>
          <div className="h-10 w-10 bg-slate-800 rounded-full border border-slate-700 flex items-center justify-center overflow-hidden">
            <img src="https://picsum.photos/seed/trading/100/100" alt="profile" />
          </div>
        </div>
      </nav>

      <main className="pt-28 pb-12 px-4 md:px-8 max-w-[1600px] mx-auto space-y-8">
        {/* Metric Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <DollarSign size={80} />
            </div>
            <div className="space-y-2">
              <p className="text-slate-400 text-sm font-medium flex items-center gap-2">
                <Activity size={16} className="text-emerald-500" />
                Current Equity
              </p>
              <h2 className="text-3xl font-bold text-white font-mono">${stats.equity.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h2>
              <div className="flex items-center gap-2 text-emerald-400 text-sm font-medium">
                <ArrowUpRight size={16} />
                +{stats.growth.toFixed(2)}% Growth
              </div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Target size={80} />
            </div>
            <div className="space-y-2">
              <p className="text-slate-400 text-sm font-medium flex items-center gap-2">
                <TrendingUp size={16} className="text-blue-500" />
                Win Rate
              </p>
              <h2 className="text-3xl font-bold text-white font-mono">{stats.winRate.toFixed(1)}%</h2>
              <div className="flex items-center gap-2 text-slate-500 text-sm">
                <span>{data.trades.filter(t => t.profit > 0).length} Wins</span>
                <span className="text-slate-700">|</span>
                <span>{data.trades.filter(t => t.profit <= 0).length} Losses</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <TrendingUp size={80} />
            </div>
            <div className="space-y-2">
              <p className="text-slate-400 text-sm font-medium flex items-center gap-2">
                <TrendingUp size={16} className="text-amber-500" />
                Profit Factor
              </p>
              <h2 className="text-3xl font-bold text-white font-mono">{data.summary.profitFactor.toFixed(2)}</h2>
              <p className="text-slate-500 text-sm">Efficiency of Strategy</p>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <TrendingDown size={80} />
            </div>
            <div className="space-y-2">
              <p className="text-slate-400 text-sm font-medium flex items-center gap-2">
                <Clock size={16} className="text-purple-500" />
                Total Net Profit
              </p>
              <h2 className={`text-3xl font-bold font-mono ${stats.totalNetProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                ${stats.totalNetProfit.toLocaleString()}
              </h2>
              <p className="text-slate-500 text-sm">Realized Gains (Net)</p>
            </div>
          </div>
        </section>

        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Equity Chart */}
            <div className="lg:col-span-2 bg-slate-900 border border-slate-800 p-8 rounded-3xl space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white">Equity Curve</h3>
                  <p className="text-sm text-slate-400">Account balance performance over time</p>
                </div>
                <div className="flex gap-2">
                  <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 text-xs font-bold rounded-full border border-emerald-500/20">LIVE DATA</span>
                </div>
              </div>
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    <XAxis 
                      dataKey="time" 
                      stroke="#475569" 
                      fontSize={12} 
                      tickLine={false} 
                      axisLine={false} 
                      tick={{ fill: '#64748b' }}
                    />
                    <YAxis 
                      domain={['auto', 'auto']} 
                      stroke="#475569" 
                      fontSize={12} 
                      tickLine={false} 
                      axisLine={false}
                      tickFormatter={(val) => `$${val.toLocaleString()}`}
                      tick={{ fill: '#64748b' }}
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                      itemStyle={{ color: '#10b981' }}
                      labelStyle={{ color: '#94a3b8', marginBottom: '4px' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="balance" 
                      stroke="#10b981" 
                      strokeWidth={3} 
                      fillOpacity={1} 
                      fill="url(#colorBalance)" 
                      animationDuration={2000}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Sidebar Stats */}
            <div className="space-y-8">
              <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl">
                <h3 className="text-lg font-bold text-white mb-6">Trade Performance</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-2xl border border-slate-700/50">
                    <span className="text-slate-400 text-sm">Avg. Trade Profit</span>
                    <span className="text-white font-mono font-semibold">${stats.avgProfit.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-2xl border border-slate-700/50">
                    <span className="text-slate-400 text-sm">Largest Win</span>
                    <span className="text-emerald-400 font-mono font-semibold">+${stats.maxWin.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-2xl border border-slate-700/50">
                    <span className="text-slate-400 text-sm">Largest Loss</span>
                    <span className="text-rose-400 font-mono font-semibold">${stats.maxLoss.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-2xl border border-slate-700/50">
                    <span className="text-slate-400 text-sm">Expected Payoff</span>
                    <span className="text-white font-mono font-semibold">$58.78</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl">
                <h3 className="text-lg font-bold text-white mb-4">Instrument Distribution</h3>
                <div className="h-[200px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={distributionData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {distributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'trades' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
            <div className="p-8 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
              <div>
                <h3 className="text-xl font-bold text-white">Full Trade Ledger</h3>
                <p className="text-sm text-slate-400">Detailed record of every position executed</p>
              </div>
              <div className="flex gap-4">
                <input 
                  type="text" 
                  placeholder="Search symbol..." 
                  className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 text-slate-200"
                />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-800/30 text-slate-400 uppercase text-xs font-bold tracking-widest border-b border-slate-800">
                    <th className="px-8 py-4">Time</th>
                    <th className="px-4 py-4">Symbol</th>
                    <th className="px-4 py-4">Type</th>
                    <th className="px-4 py-4 text-right">Volume</th>
                    <th className="px-4 py-4 text-right">Entry Price</th>
                    <th className="px-4 py-4 text-right">Exit Price</th>
                    <th className="px-4 py-4 text-right">Profit</th>
                    <th className="px-8 py-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {data.trades.map((trade, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/50 transition-colors group">
                      <td className="px-8 py-4 text-sm text-slate-300 font-mono">{trade.time}</td>
                      <td className="px-4 py-4">
                        <span className="font-bold text-white">{trade.symbol}</span>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-tighter ${trade.type === 'buy' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-500 border border-rose-500/20'}`}>
                          {trade.type}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-right text-sm font-mono text-slate-300">{trade.volume.toFixed(2)}</td>
                      <td className="px-4 py-4 text-right text-sm font-mono text-slate-400">{trade.entryPrice.toLocaleString()}</td>
                      <td className="px-4 py-4 text-right text-sm font-mono text-slate-400">{trade.exitPrice.toLocaleString()}</td>
                      <td className={`px-4 py-4 text-right font-mono font-bold ${trade.profit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {trade.profit >= 0 ? '+' : ''}{trade.profit.toFixed(2)}
                      </td>
                      <td className="px-8 py-4 text-right">
                        <button className="text-slate-500 hover:text-white transition-colors">
                          <ChevronRight size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'distribution' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl space-y-6">
              <h3 className="text-xl font-bold text-white">Profit Distribution</h3>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.trades.slice(-20)}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    <XAxis dataKey="time" hide />
                    <YAxis 
                      stroke="#475569" 
                      fontSize={12} 
                      tickFormatter={(val) => `$${val}`} 
                      tick={{ fill: '#64748b' }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip 
                      cursor={{fill: '#1e293b'}}
                      contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                    />
                    <Bar dataKey="profit" radius={[4, 4, 0, 0]}>
                      {data.trades.slice(-20).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.profit >= 0 ? '#10b981' : '#ef4444'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl space-y-6">
               <h3 className="text-xl font-bold text-white">Profit vs Volume Analysis</h3>
               <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.trades.slice(-15)}>
                      <XAxis dataKey="volume" label={{ value: 'Volume', position: 'insideBottom', offset: -5, fill: '#475569' }} tick={{ fill: '#64748b' }} axisLine={false} tickLine={false} />
                      <YAxis stroke="#475569" tick={{ fill: '#64748b' }} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }} />
                      <Bar dataKey="profit" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
               </div>
            </div>
          </div>
        )}
      </main>

      {/* Floating Status Bar */}
      <footer className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-900/90 border border-emerald-500/30 px-6 py-3 rounded-2xl backdrop-blur-xl shadow-2xl flex items-center gap-8 z-40">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-bold text-emerald-500 tracking-wider">MARKET OPEN</span>
        </div>
        <div className="h-4 w-px bg-slate-800" />
        <div className="flex items-center gap-4 text-xs font-medium uppercase tracking-tighter">
          <span className="text-slate-400">Total Volume</span>
          <span className="text-white font-mono">{data.trades.reduce((a, b) => a + b.volume, 0).toFixed(2)} Lot</span>
        </div>
        <div className="h-4 w-px bg-slate-800" />
        <div className="flex items-center gap-4 text-xs font-medium uppercase tracking-tighter">
          <span className="text-slate-400">Recovery Factor</span>
          <span className="text-emerald-400 font-mono">14.82</span>
        </div>
      </footer>
    </div>
  );
};

export default App;
