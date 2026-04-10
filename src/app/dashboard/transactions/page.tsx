import { getTransactions, getCategories } from '@/lib/db/actions';
import TransactionsClient from '@/components/transactions/TransactionsClient';

export default async function TransactionsPage() {
  const [transactions, categories] = await Promise.all([
    getTransactions(),
    getCategories(),
  ]);

  return <TransactionsClient transactions={transactions} categories={categories} />;
}
