import { getTransactions } from '../db/actions';

interface Transaction {
  id: number;
  user_id: string;
  category_id: number | null;
  amount: number;
  type: 'income' | 'expense';
  description: string;
  date: string;
  created_at: string;
  updated_at: string;
}

export async function predictExpenses() {
  const transactions = (await getTransactions()) as Transaction[];
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const recentTransactions = transactions.filter(
    (t) => new Date(t.date) > sixMonthsAgo && t.type === 'expense'
  );

  const monthlyExpenses: { [key: string]: { [key: string]: number } } = {};

  for (const t of recentTransactions) {
    const month = new Date(t.date).toLocaleString('default', { month: 'long', year: 'numeric' });
    const category = t.category_id ? t.category_id.toString() : 'uncategorized';

    if (!monthlyExpenses[month]) {
      monthlyExpenses[month] = {};
    }
    if (!monthlyExpenses[month][category]) {
      monthlyExpenses[month][category] = 0;
    }
    monthlyExpenses[month][category] += t.amount;
  }

  const categoryAverages: { [key: string]: number } = {};
  const categoryCounts: { [key: string]: number } = {};

  for (const month in monthlyExpenses) {
    for (const category in monthlyExpenses[month]) {
      if (!categoryAverages[category]) {
        categoryAverages[category] = 0;
        categoryCounts[category] = 0;
      }
      categoryAverages[category] += monthlyExpenses[month][category];
      categoryCounts[category]++;
    }
  }

  const predictedExpenses: { [key: string]: number } = {};
  for (const category in categoryAverages) {
    predictedExpenses[category] = categoryAverages[category] / categoryCounts[category];
  }

  return predictedExpenses;
}
