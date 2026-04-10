import KpiCard from '@/components/dashboard/KpiCard';
import ExpenseChart from '@/components/charts/ExpenseChart';
import CategoryChart from '@/components/charts/CategoryChart';
import IncomeExpenseChart from '@/components/charts/IncomeExpenseChart';
import BudgetChart from '@/components/charts/BudgetChart';
import SavingsChart from '@/components/charts/SavingsChart';
import TransactionsTable from '@/components/dashboard/TransactionsTable';
import AddTransaction from '@/components/dashboard/AddTransaction';
import PredictionCard from '@/components/dashboard/PredictionCard';
import {
  getTransactions,
  getMonthlyStats,
  getMonthlyChartData,
  getCategoryExpenses,
  getBudgetVsActual,
  getCategories,
} from '@/lib/db/actions';

export default async function DashboardPage() {
  const [transactions, stats, chartData, categoryData, budgetData, categories] =
    await Promise.all([
      getTransactions({ limit: 10 }),
      getMonthlyStats(),
      getMonthlyChartData(),
      getCategoryExpenses(),
      getBudgetVsActual(),
      getCategories(),
    ]);

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);

  return (
    <>
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KpiCard title="Total Balance" value={formatCurrency(stats.balance)} icon="wallet" trend={stats.balance >= 0 ? 'up' : 'down'} color="blue" />
        <KpiCard title="Monthly Income" value={formatCurrency(stats.income)} icon="trending-up" trend="up" color="green" />
        <KpiCard title="Monthly Expenses" value={formatCurrency(stats.expenses)} icon="trending-down" trend="down" color="red" />
        <KpiCard title="Savings" value={formatCurrency(stats.savings)} icon="piggy-bank" trend={stats.savings >= 0 ? 'up' : 'down'} color="purple" />
      </div>

      {/* Add Transaction + Prediction */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <AddTransaction categories={categories} />
        </div>
        <PredictionCard />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <ExpenseChart data={chartData} />
        <CategoryChart data={categoryData} />
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <IncomeExpenseChart data={chartData} />
        </div>
        <BudgetChart data={budgetData} />
      </div>

      {/* Savings + Transactions */}
      <div className="mb-8">
        <SavingsChart data={chartData} />
      </div>
      <TransactionsTable transactions={transactions} />
    </>
  );
}
