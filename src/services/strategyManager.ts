import { CashInStrategy } from '@services/commissionStrategies/cashInStrategy';
import { CashOutNaturalStrategy } from '@services/commissionStrategies/cashOutNaturalStrategy';
import { CashOutJuridicalStrategy } from '@services/commissionStrategies/cashOutJuridicalStrategy';
import { OperationTypes } from '@utils/enums';
import { BaseStrategy } from '@services/commissionStrategies/baseStrategy';

export class StrategyManager {
  private strategies: { [key: string]: BaseStrategy };

  constructor() {
    this.strategies = {
      [OperationTypes.CASH_IN]: new CashInStrategy(),
      [OperationTypes.CASH_OUT_NATURAL]: new CashOutNaturalStrategy(),
      [OperationTypes.CASH_OUT_JURIDICAL]: new CashOutJuridicalStrategy(),
    };
  }

  getStrategy(transaction: any): BaseStrategy | null {
    if (transaction.type === OperationTypes.CASH_IN) {
      return this.strategies[OperationTypes.CASH_IN];
    }
    if (transaction.type === 'cash_out' && transaction.user_type === 'natural') {
      return this.strategies[OperationTypes.CASH_OUT_NATURAL];
    }
    if (transaction.type === 'cash_out' && transaction.user_type === 'juridical') {
      return this.strategies[OperationTypes.CASH_OUT_JURIDICAL];
    }
    return null;
  }
}
