import { BaseStrategy } from '@services/commissionStrategies/baseStrategy';
import axios from 'axios';
import { roundUp, isFreeOfChargeDay } from '@utils/helper';
import CashOutOperations from '@services/CashOutOperations';

const cashOutOps = CashOutOperations.getInstance();

const CASH_OUT_NATURAL_API = `${process.env.BASE_API_URL}/tasks/api/cash-out-natural`;

export class CashOutNaturalStrategy extends BaseStrategy {
  async calculate(transaction: any, transactions: any[]): Promise<number> {
    const config = await axios.get(CASH_OUT_NATURAL_API).then((res) => res.data);
    const weekLimit = config.week_limit.amount;

    cashOutOps.addOperation(transaction.user_id, transaction.operation.amount, transaction.date);
    const amountExceeded = cashOutOps.getAmountExceeded(transaction.user_id, transaction.date, weekLimit)
    const freeOfChargeDay = isFreeOfChargeDay(transaction.date)

    let fee = 0

    if (freeOfChargeDay) {
      if (amountExceeded) {
        fee = Math.min(transaction.operation.amount, amountExceeded) * (config.percents / 100)
      }
    } else {
      fee = Math.min(transaction.operation.amount, amountExceeded) * (config.percents / 100)
    }

    return roundUp(fee);
  }
}
