import dotenv from 'dotenv';
dotenv.config();
import 'module-alias/register';
import { processFile } from './main';

const inputFilePath = process.argv[2];

if (!inputFilePath) {
  console.error('Please provide the path to the input file');
  process.exit(1);
}

processFile(inputFilePath);
