
import { Trade, Deal, ReportSummary } from '../types';

/**
 * Cleans the numeric strings from the MT5 CSV which often include spaces and weird minus signs
 */
const cleanNum = (str: string): number => {
  if (!str) return 0;
  // Remove spaces and normalize minus sign
  const cleaned = str.replace(/\s/g, '').replace(/−/g, '-');
  return parseFloat(cleaned) || 0;
};

export const parseTradeHistory = (csvText: string) => {
  const lines = csvText.split('\n').map(l => l.trim());
  
  const trades: Trade[] = [];
  const deals: Deal[] = [];
  let summary: Partial<ReportSummary> = {};

  let currentSection = '';

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line) continue;

    const cols = line.split(',').map(c => c.trim());

    // Detect Sections
    if (line.startsWith('Name:')) {
      summary.name = cols[3];
      continue;
    }
    if (line.startsWith('Account:')) {
      summary.account = cols[3];
      continue;
    }
    if (line.startsWith('Company:')) {
      summary.company = cols[3];
      continue;
    }

    if (line.startsWith('Positions')) {
      currentSection = 'positions';
      continue;
    }
    if (line.startsWith('Deals')) {
      currentSection = 'deals';
      continue;
    }
    if (line.startsWith('Results')) {
      currentSection = 'results';
      continue;
    }

    // Parse Sections
    if (currentSection === 'positions' && cols.length >= 13 && cols[1] !== 'Position') {
      const entryTime = cols[0];
      const exitTime = cols[8];
      
      const t1 = new Date(entryTime.replace(/\./g, '/')).getTime();
      const t2 = new Date(exitTime.replace(/\./g, '/')).getTime();
      const duration = Math.round((t2 - t1) / (1000 * 60));

      trades.push({
        time: entryTime,
        position: cols[1],
        symbol: cols[2],
        type: cols[3].toLowerCase() as 'buy' | 'sell',
        volume: cleanNum(cols[4]),
        entryPrice: cleanNum(cols[5]),
        exitTime: exitTime,
        exitPrice: cleanNum(cols[9]),
        commission: cleanNum(cols[10]),
        swap: cleanNum(cols[11]),
        profit: cleanNum(cols[12]),
        durationMinutes: duration
      });
    }

    if (currentSection === 'deals' && cols.length >= 13 && cols[1] !== 'Deal') {
        deals.push({
            time: cols[0],
            dealId: cols[1],
            symbol: cols[2],
            type: cols[3],
            direction: cols[4],
            volume: cleanNum(cols[5]),
            price: cleanNum(cols[6]),
            profit: cleanNum(cols[11]),
            balance: cleanNum(cols[12]),
            comment: cols[13] || ''
        });
    }

    if (currentSection === 'results') {
        if (line.includes('Total Net Profit:')) summary.totalNetProfit = cleanNum(cols[3]);
        if (line.includes('Profit Factor:')) summary.profitFactor = cleanNum(cols[3]);
        if (line.includes('Total Trades:')) summary.totalTrades = cleanNum(cols[3]);
        if (line.includes('Profit Trades')) {
             const wins = parseInt(cols[4].split(' ')[0]);
             summary.winRate = (wins / (summary.totalTrades || 1)) * 100;
        }
    }
  }

  // Find initial deposit
  const initialDepositDeal = deals.find(d => d.comment.toLowerCase().includes('deposit'));
  summary.initialDeposit = initialDepositDeal ? initialDepositDeal.balance : 0;
  summary.finalBalance = deals.length > 0 ? deals[deals.length - 1].balance : 0;

  return { trades, deals, summary: summary as ReportSummary };
};
