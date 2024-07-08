import {
  parseISO, startOfWeek, endOfWeek, isWithinInterval, format,
} from 'date-fns';

class CashOutOperations {
  private static instance: CashOutOperations;

  private operations: { [userId: string]: { amount: number; date: Date }[] };

  private constructor() {
    this.operations = {};
  }

  public static getInstance(): CashOutOperations {
    if (!CashOutOperations.instance) {
      CashOutOperations.instance = new CashOutOperations();
    }
    return CashOutOperations.instance;
  }

  public resetOperations(): void {
    this.operations = {};
  }

  public addOperation(userId: string, amount: number, date: string): void {
    const parsedDate = parseISO(date);
    if (!this.operations[userId]) {
      this.operations[userId] = [];
    }
    this.operations[userId].push({ amount, date: parsedDate });
  }

  public getCashOutSum(userId: string, date: string): number {
    const parsedDate = typeof date === 'string' ? parseISO(date) : date;
    if (!this.operations[userId]) {
      return 0;
    }
    const weekInterval = {
      start: startOfWeek(parsedDate, { weekStartsOn: 1 }),
      end: endOfWeek(parsedDate, { weekStartsOn: 1 }),
    };

    return this.operations[userId]
      .filter((operation) => isWithinInterval(operation.date, weekInterval))
      .reduce((sum, transaction) => sum + transaction.amount, 0);
  }

  public getAmountExceeded(userId: string, date: string, weeklyLimit: number): number {
    const sum = this.getCashOutSum(userId, date);
    return sum > weeklyLimit ? sum - weeklyLimit : 0;
  }
}

export default CashOutOperations;
