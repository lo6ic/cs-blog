import { read } from 'fs';

type TransactionStatus = 'pending' | 'cleared' | 'failed';

type TransactionType = 'income' | 'expense';

type TransactionCategory =
  | 'education'
  | 'groceries'
  | 'transportation'
  | 'housing'
  | 'entertainment'
  | 'income'
  | 'uncategorized';

type Transaction = {
  readonly id: number;
  readonly createdAt: string;
  merchant: string;
  amount: number;
  type: TransactionType;
  status: TransactionStatus;
  category: TransactionCategory;
  notes?: string;
};

const trans1: Transaction = {
  id: 1,
  createdAt: '2026-01-01',
  merchant: 'WalMart',
  amount: 12.99,
  type: 'expense',
  status: 'cleared',
  category: 'entertainment',
  notes: 'fun stuff',
};

const trans2: Transaction = {
  id: 2,
  createdAt: '2026-01-11',
  merchant: 'Landlord',
  amount: 550.0,
  type: 'expense',
  status: 'pending',
  category: 'housing',
  notes: 'rent',
};

const trans3: Transaction = {
  id: 3,
  createdAt: '2026-01-21',
  merchant: 'HyVee',
  amount: 12.99,
  type: 'expense',
  status: 'cleared',
  category: 'groceries',
};

const trans4: Transaction = {
  id: 4,
  createdAt: '2026-01-30',
  merchant: 'CarMax',
  amount: 15.99,
  type: 'income',
  status: 'failed',
  category: 'transportation',
  notes: 'refund',
};

type RequestState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'empty' }
  | { status: 'error'; message: string };

const theTransactions = [trans1, trans2, trans3, trans4];

const transactionSuccess: RequestState<Transaction[]> = {
  status: 'success',
  data: theTransactions,
};

const transactionError: RequestState<Transaction[]> = {
  status: 'error',
  message: 'No transactions',
};

const transactionEmpty: RequestState<Transaction[]> = {
  status: 'empty',
};

type TransactionFilter = {
  status?: TransactionStatus;
  type?: TransactionType;
  category?: TransactionCategory;
  minAmount?: number;
  maxAmount?: number;
};

function filterTransactions(
  transactions: readonly Transaction[],
  filter: TransactionFilter,
): Transaction[] {
  return transactions.filter((transaction) => {
    if (filter.status && transaction.status !== filter.status) return false;
    if (filter.type && transaction.type !== filter.type) return false;
    if (filter.category && transaction.category !== filter.category)
      return false;
    if (filter.minAmount !== undefined && transaction.amount < filter.minAmount)
      return false;
    if (filter.maxAmount !== undefined && transaction.amount > filter.maxAmount)
      return false;
    return true;
  });
}

const clearedExpenses = filterTransactions(theTransactions, {
  status: 'cleared',
  type: 'expense',
});

const educationTransactions = filterTransactions(theTransactions, {
  category: 'education',
});

console.log('The transactions: ', theTransactions);
console.log('cleared expenses: ', clearedExpenses);
console.log('education transactions: ', educationTransactions);

type TransactionSortKey = 'createdAt' | 'amount' | 'merchant';
type SortDirection = 'asc' | 'desc';

function sortTransactions(
  transactions: readonly Transaction[],
  sortKey: TransactionSortKey,
  direction?: SortDirection,
): Transaction[] {
  return [...transactions].sort((a, b) => {
    let comparison = 0;

    if (sortKey === 'amount') {
      comparison = a.amount - b.amount;
    }

    if (sortKey === 'createdAt') {
      comparison = a.createdAt.localeCompare(b.createdAt);
    }

    if (sortKey === 'merchant') {
      comparison = a.merchant.localeCompare(b.merchant);
    }

    return direction === 'asc' ? comparison : -comparison;
  });
}

function renderTransactionState(state: RequestState<Transaction[]>): string {
  switch (state.status) {
    case 'idle':
      return 'No transactions requested yet.';

    case 'loading':
      return 'Loading transactions...';

    case 'success':
      return `Loaded ${state.data.length} transactions.`;

    case 'empty':
      return 'No transactions found.';

    case 'error':
      return `Error: ${state.message}`;
  }
}
