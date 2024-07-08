import { expect } from 'chai';
import { calculateCommissions } from '../services/commissionService';
import { Transaction } from '../types/transaction';
import { format } from 'date-fns';
import CashOutOperations from '@services/CashOutOperations';

const formatDate = (date: Date) => format(date, 'yyyy-MM-dd');

describe('Commission Service', () => {
  let cashOutOps: CashOutOperations;

  beforeEach(() => {
    cashOutOps = CashOutOperations.getInstance();
    cashOutOps.resetOperations();
  });

  it('should calculate correct commissions', async () => {
    const transactions: Transaction[] = [
      { "date": "2016-01-05", "user_id": 1, "user_type": "natural", "type": "cash_in", "operation": { "amount": 200.00, "currency": "EUR" } },
      { "date": "2016-01-06", "user_id": 2, "user_type": "juridical", "type": "cash_out", "operation": { "amount": 300.00, "currency": "EUR" } },
      { "date": "2016-01-06", "user_id": 1, "user_type": "natural", "type": "cash_out", "operation": { "amount": 30000, "currency": "EUR" } }
    ];

    const expectedResults = ["0.06", "0.90", "87.00"];

    const results = await calculateCommissions(transactions);
    expect(results).to.deep.equal(expectedResults);
  });


  it('should calculate correct commissions considering cash out limit exceeded', async () => {
    const transactions: Transaction[] = [
      { "date": "2016-01-05", "user_id": 1, "user_type": "natural", "type": "cash_in", "operation": { "amount": 200.00, "currency": "EUR" } },
      { "date": "2016-01-06", "user_id": 2, "user_type": "juridical", "type": "cash_out", "operation": { "amount": 300.00, "currency": "EUR" } },
      { "date": "2016-01-06", "user_id": 1, "user_type": "natural", "type": "cash_out", "operation": { "amount": 30000, "currency": "EUR" } },
      { "date": "2016-01-07", "user_id": 1, "user_type": "natural", "type": "cash_out", "operation": { "amount": 1000.00, "currency": "EUR" } },
      { "date": "2016-01-07", "user_id": 1, "user_type": "natural", "type": "cash_out", "operation": { "amount": 100.00, "currency": "EUR" } },
      { "date": "2016-01-10", "user_id": 1, "user_type": "natural", "type": "cash_out", "operation": { "amount": 100.00, "currency": "EUR" } },
      { "date": "2016-01-10", "user_id": 2, "user_type": "juridical", "type": "cash_in", "operation": { "amount": 1000000.00, "currency": "EUR" } },
      { "date": "2016-01-10", "user_id": 3, "user_type": "natural", "type": "cash_out", "operation": { "amount": 1000.00, "currency": "EUR" } },
      { "date": "2016-02-15", "user_id": 1, "user_type": "natural", "type": "cash_out", "operation": { "amount": 300.00, "currency": "EUR" } },
    ]

    const expectedResults = [
      "0.06",
      "0.90",
      "87.00",
      "3.00",
      "0.30",
      "0.30",
      "5.00",
      "0.00",
      "0.00",
    ];

    const results = await calculateCommissions(transactions);
    expect(results).to.deep.equal(expectedResults);
  });
});


describe('CashOutOperations', () => {
  let cashOutOps: CashOutOperations;

  beforeEach(() => {
    cashOutOps = CashOutOperations.getInstance();
    cashOutOps.resetOperations();
  });

  it('should add operations and calculate sum correctly', () => {
    cashOutOps.addOperation('user1', 500, '2024-07-01');
    cashOutOps.addOperation('user1', 600, '2024-07-02');

    expect(cashOutOps.getCashOutSum('user1', '2024-07-02')).to.equal(1100);
  });

  it('should calculate amount exceeded correctly', () => {
    cashOutOps.addOperation('user1', 500, '2024-07-01');
    cashOutOps.addOperation('user1', 600, '2024-07-02');

    expect(cashOutOps.getAmountExceeded('user1', '2024-07-02', 1000)).to.equal(100);
  });

  it('should not exceed amount if within limit', () => {
    cashOutOps.addOperation('user2', 200, '2024-07-03');

    expect(cashOutOps.getAmountExceeded('user2', '2024-07-03', 1000)).to.equal(0);
  });

  it('should handle operations spanning multiple weeks', () => {
    cashOutOps.addOperation('user1', 500, '2024-07-01');
    cashOutOps.addOperation('user1', 600, '2024-07-02');
    cashOutOps.addOperation('user1', 300, '2024-07-10'); // Next week

    expect(cashOutOps.getCashOutSum('user1', '2024-07-02')).to.equal(1100);
    expect(cashOutOps.getCashOutSum('user1', '2024-07-10')).to.equal(300);
  });

  it('should reset operations correctly', () => {
    cashOutOps.addOperation('user1', 500, '2024-07-01');
    cashOutOps.resetOperations();

    expect(cashOutOps.getCashOutSum('user1', '2024-07-01')).to.equal(0);
  });

  it('should handle operations with Date objects', () => {
    const date1 = new Date(2024, 6, 1); // July 1, 2024
    const date2 = new Date(2024, 6, 2); // July 2, 2024

    cashOutOps.addOperation('user1', 500, formatDate(date1));
    cashOutOps.addOperation('user1', 600, formatDate(date2));

    expect(cashOutOps.getCashOutSum('user1', formatDate(date2))).to.equal(1100);
    expect(cashOutOps.getAmountExceeded('user1', formatDate(date2), 1000)).to.equal(100);
  });
});
