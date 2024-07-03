import { StrategyManager } from '@services/strategyManager';
import fs from 'fs';
import path from 'path';
import { Transaction } from '../types/transaction';

const logFilePath = path.resolve('logs/errors.log');

export const calculateCommissions = async (transactions: Transaction[]): Promise<(string | null)[]> => {
  const strategyManager = new StrategyManager();
  const results: (string | null)[] = [];

  for (const transaction of transactions) {
    const strategy = strategyManager.getStrategy(transaction);
    if (strategy) {
      try {
        const fee = await strategy.calculate(transaction, transactions);
        results.push(fee.toFixed(2));
      } catch (error) {
        if (error instanceof Error) {
          logError(transaction, error.message);
        } else {
          logError(transaction, 'Unknown error');
        }
        results.push(null);
      }
    } else {
      logError(transaction, 'Unsupported operation type or user type');
      results.push(null);
    }
  }
  return results;
};

const logError = (transaction: Transaction, message: string): void => {
  const logEntry = {
    date: new Date().toISOString(),
    transaction,
    message,
  };
  fs.appendFileSync(logFilePath, `${JSON.stringify(logEntry)}\n`);
};
