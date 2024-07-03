import { expect } from 'chai';
import { calculateCommissions } from '../services/commissionService';
import { Transaction } from '../types/transaction';

describe('Commission Service', () => {
  it('should calculate correct commissions', async () => {
    const transactions: Transaction[] = [
      { "date": "2016-01-05", "user_id": 1, "user_type": "natural", "type": "cash_in", "operation": { "amount": 200.00, "currency": "EUR" } },
      { "date": "2016-01-06", "user_id": 2, "user_type": "juridical", "type": "cash_out", "operation": { "amount": 300.00, "currency": "EUR" } },
      { "date": "2016-01-06", "user_id": 1, "user_type": "natural", "type": "cash_out", "operation": { "amount": 30000, "currency": "EUR" } }
    ];

    const expectedResults = ['0.06', '0.90', '87.00'];

    const results = await calculateCommissions(transactions);
    expect(results).to.deep.equal(expectedResults);
  });
});
