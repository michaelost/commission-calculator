import { BaseStrategy } from '@services/commissionStrategies/baseStrategy';
import axios from 'axios';
import { roundUp } from '@utils/helper';

const CASH_OUT_NATURAL_API = `${process.env.BASE_API_URL}/tasks/api/cash-out-natural`;

export class CashOutNaturalStrategy extends BaseStrategy {
  async calculate(transaction: any, transactions: any[]): Promise<number> {
    const config = await axios.get(CASH_OUT_NATURAL_API).then((res) => res.data);
    const weekLimit = config.week_limit.amount;

    const weeklyTotal = transactions
      .filter((tx) => tx.user_id === transaction.user_id && tx.type === 'cash_out')
      .reduce((sum, tx) => sum + tx.operation.amount, 0);

    if (weeklyTotal <= weekLimit) {
      return 0;
    }

    const exceededAmount = Math.max(0, weeklyTotal - weekLimit);
    const fee = exceededAmount * (config.percents / 100);
    return roundUp(fee);
  }
}
