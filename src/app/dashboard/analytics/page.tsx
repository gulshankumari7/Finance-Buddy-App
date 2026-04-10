import { getMonthlyChartData, getCategoryExpenses, getBudgetVsActual, getMonthlyStats } from '@/lib/db/actions';
import AnalyticsClient from '@/components/analytics/AnalyticsClient';

export default async function AnalyticsPage() {
  const [chartData, categoryData, budgetData, stats] = await Promise.all([
    getMonthlyChartData(),
    getCategoryExpenses(),
    getBudgetVsActual(),
    getMonthlyStats(),
  ]);

  return (
    <AnalyticsClient
      chartData={chartData}
      categoryData={categoryData}
      budgetData={budgetData}
      stats={stats}
    />
  );
}
