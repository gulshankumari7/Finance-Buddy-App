import Header from '../layout/Header';
import Sidebar from '../layout/Sidebar';
import KpiCard from './KpiCard';
import ExpenseChart from '../charts/ExpenseChart';
import CategoryChart from '../charts/CategoryChart';
import IncomeExpenseChart from '../charts/IncomeExpenseChart';
import BudgetChart from '../charts/BudgetChart';
import SavingsChart from '../charts/SavingsChart';
import TransactionsTable from './TransactionsTable';
import {
  getTransactions,
  getMonthlyStats,
  getMonthlyChartData,
  getCategoryExpenses,
  getBudgetVsActual,
  getCategories,
} from '@/lib/db/actions';
import AddTransaction from './AddTransaction';
import PredictionCard from './PredictionCard';

const Dashboard = async () => {
  const [transactions, stats, chartData, categoryData, budgetData, categories] =
    await Promise.all([
      getTransactions(),
      getMonthlyStats(),
      getMonthlyChartData(),
      getCategoryExpenses(),
      getBudgetVsActual(),
      getCategories(),
    ]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gradient-to-br from-gray-50 to-gray-100 p-8">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <KpiCard
              title="Total Balance"
              value={formatCurrency(stats.balance)}
              icon="wallet"
              trend={stats.balance >= 0 ? 'up' : 'down'}
              color="blue"
            />
            <KpiCard
              title="Monthly Income"
              value={formatCurrency(stats.income)}
              icon="trending-up"
              trend="up"
              color="green"
            />
            <KpiCard
              title="Monthly Expenses"
              value={formatCurrency(stats.expenses)}
              icon="trending-down"
              trend="down"
              color="red"
            />
            <KpiCard
              title="Savings"
              value={formatCurrency(stats.savings)}
              icon="piggy-bank"
              trend={stats.savings >= 0 ? 'up' : 'down'}
              color="purple"
            />
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
          <div>
            <TransactionsTable transactions={transactions} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
