import { BaseStrategy } from '@services/commissionStrategies/baseStrategy';
import axios from 'axios';
import { roundUp } from '@utils/helper';

const CASH_OUT_JURIDICAL_API = `${process.env.BASE_API_URL}/tasks/api/cash-out-juridical`;

export class CashOutJuridicalStrategy extends BaseStrategy {
  async calculate(transaction: any): Promise<number> {
    const config = await axios.get(CASH_OUT_JURIDICAL_API).then((res) => res.data);
    const fee = transaction.operation.amount * (config.percents / 100);
    return roundUp(Math.max(fee, 0.50));
  }
}
