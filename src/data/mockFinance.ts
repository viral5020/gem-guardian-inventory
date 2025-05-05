
export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'deposit' | 'withdrawal';
  account: 'cash' | 'bank';
}

export const cashBalance = 25750;
export const bankBalance = 432800;

export const recentTransactions: Transaction[] = [
  {
    id: "trans-001",
    date: "2025-05-03",
    description: "Diamond Purchase - SKU 12345",
    amount: 12000,
    type: "withdrawal",
    account: "bank"
  },
  {
    id: "trans-002",
    date: "2025-05-02",
    description: "Diamond Sale - SKU 98765",
    amount: 18500,
    type: "deposit",
    account: "bank"
  },
  {
    id: "trans-003",
    date: "2025-05-01",
    description: "Office Supplies",
    amount: 350,
    type: "withdrawal",
    account: "cash"
  },
  {
    id: "trans-004",
    date: "2025-04-29",
    description: "Diamond Sale - SKU 45678",
    amount: 8700,
    type: "deposit",
    account: "cash"
  },
  {
    id: "trans-005",
    date: "2025-04-28",
    description: "Transfer to Bank Account",
    amount: 5000,
    type: "withdrawal",
    account: "cash"
  },
  {
    id: "trans-006",
    date: "2025-04-28",
    description: "Transfer from Cash",
    amount: 5000,
    type: "deposit",
    account: "bank"
  },
  {
    id: "trans-007",
    date: "2025-04-27",
    description: "Diamond Purchase - SKU 23456",
    amount: 15800,
    type: "withdrawal",
    account: "bank"
  }
];
