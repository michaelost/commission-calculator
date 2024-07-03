import fs from 'fs';
import path from 'path';
import { calculateCommissions } from '@services/commissionService';

export const processFile = async (inputFilePath: string): Promise<void> => {
  const inputFile = path.resolve(__dirname, '../data', inputFilePath);

  fs.readFile(inputFile, 'utf8', async (err, data) => {
    if (err) {
      console.error('Error reading input file:', err);
      process.exit(1);
    }

    try {
      const transactions = JSON.parse(data);
      const results = await calculateCommissions(transactions);
      results.forEach(result => console.log(result));
    } catch (err) {
      console.error('Error processing data:', err);
      process.exit(1);
    }
  });
};
