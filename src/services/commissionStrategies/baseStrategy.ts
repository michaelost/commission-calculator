export abstract class BaseStrategy {
  abstract calculate(transaction: any, transactions?: any[]): Promise<number>;
}
  