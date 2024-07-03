import { BaseStrategy } from '@services/commissionStrategies/baseStrategy';
import axios from 'axios';
import { roundUp } from '@utils/helper';

const CASH_IN_API = `${process.env.BASE_API_URL}/tasks/api/cash-in`;

export class CashInStrategy extends BaseStrategy {
  async calculate(transaction: any): Promise<number> {
    const config = await axios.get(CASH_IN_API).then((res) => res.data);
    const fee = transaction.operation.amount * (config.percents / 100);
    return roundUp(Math.min(fee, config.max.amount));
  }
}
