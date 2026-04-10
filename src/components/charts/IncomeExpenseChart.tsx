'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { motion } from 'framer-motion';

interface ChartDataPoint {
  name: string;
  income: number;
  expenses: number;
}

const IncomeExpenseChart = ({ data }: { data: ChartDataPoint[] }) => {
  const chartData = data.length > 0 ? data : [{ name: 'No Data', income: 0, expenses: 0 }];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="rounded-2xl bg-white p-6 shadow-lg shadow-gray-200/50 border border-gray-100"
    >
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Income vs Expenses</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} barGap={8}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
          <YAxis stroke="#9ca3af" fontSize={12} />
          <Tooltip
            contentStyle={{
              borderRadius: '12px',
              border: '1px solid #e5e7eb',
              boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
            }}
          />
          <Legend />
          <Bar dataKey="income" fill="#10b981" radius={[6, 6, 0, 0]} />
          <Bar dataKey="expenses" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

export default IncomeExpenseChart;
