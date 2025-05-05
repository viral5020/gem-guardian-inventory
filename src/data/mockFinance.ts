
export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'deposit' | 'withdrawal';
  account: 'cash' | 'bank';
}

export let cashBalance = 25750;
export let bankBalance = 432800;

export let recentTransactions: Transaction[] = [
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

export const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
  const newTransaction = {
    ...transaction,
    id: `trans-${Math.floor(Math.random() * 100000).toString().padStart(6, '0')}`,
  };
  
  // Update balances
  if (transaction.account === 'cash') {
    cashBalance = transaction.type === 'deposit' 
      ? cashBalance + transaction.amount 
      : cashBalance - transaction.amount;
  } else {
    bankBalance = transaction.type === 'deposit' 
      ? bankBalance + transaction.amount 
      : bankBalance - transaction.amount;
  }
  
  // Add to transactions
  recentTransactions = [newTransaction, ...recentTransactions];
  return newTransaction;
};

export const updateTransaction = (
  id: string, 
  updatedTransaction: Omit<Transaction, 'id'>
) => {
  // Find the existing transaction
  const existingTransaction = recentTransactions.find(t => t.id === id);
  if (!existingTransaction) return null;
  
  // Reverse the effect of the old transaction on balance
  if (existingTransaction.account === 'cash') {
    cashBalance = existingTransaction.type === 'deposit' 
      ? cashBalance - existingTransaction.amount 
      : cashBalance + existingTransaction.amount;
  } else {
    bankBalance = existingTransaction.type === 'deposit' 
      ? bankBalance - existingTransaction.amount 
      : bankBalance + existingTransaction.amount;
  }
  
  // Apply the effect of the new transaction
  if (updatedTransaction.account === 'cash') {
    cashBalance = updatedTransaction.type === 'deposit' 
      ? cashBalance + updatedTransaction.amount 
      : cashBalance - updatedTransaction.amount;
  } else {
    bankBalance = updatedTransaction.type === 'deposit' 
      ? bankBalance + updatedTransaction.amount 
      : bankBalance - updatedTransaction.amount;
  }
  
  // Update the transaction list
  recentTransactions = recentTransactions.map(t => 
    t.id === id ? { ...updatedTransaction, id } : t
  );
  
  return { ...updatedTransaction, id };
};

export const deleteTransaction = (id: string) => {
  // Find the transaction
  const transaction = recentTransactions.find(t => t.id === id);
  if (!transaction) return false;
  
  // Reverse its effect on the balance
  if (transaction.account === 'cash') {
    cashBalance = transaction.type === 'deposit' 
      ? cashBalance - transaction.amount 
      : cashBalance + transaction.amount;
  } else {
    bankBalance = transaction.type === 'deposit' 
      ? bankBalance - transaction.amount 
      : bankBalance + transaction.amount;
  }
  
  // Remove from the list
  recentTransactions = recentTransactions.filter(t => t.id !== id);
  return true;
};
