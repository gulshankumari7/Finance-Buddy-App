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

interface BudgetDataPoint {
  name: string;
  budget: number;
  actual: number;
}

const BudgetChart = ({ data }: { data: BudgetDataPoint[] }) => {
  const chartData = data.length > 0 ? data : [
    { name: 'No budgets set', budget: 0, actual: 0 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="rounded-2xl bg-white p-6 shadow-lg shadow-gray-200/50 border border-gray-100"
    >
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Budget vs Actual</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} layout="vertical" barGap={4}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis type="number" stroke="#9ca3af" fontSize={12} />
          <YAxis type="category" dataKey="name" stroke="#9ca3af" fontSize={12} width={80} />
          <Tooltip
            contentStyle={{
              borderRadius: '12px',
              border: '1px solid #e5e7eb',
              boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
            }}
          />
          <Legend />
          <Bar dataKey="budget" fill="#c4b5fd" radius={[0, 6, 6, 0]} />
          <Bar dataKey="actual" fill="#8b5cf6" radius={[0, 6, 6, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

export default BudgetChart;
