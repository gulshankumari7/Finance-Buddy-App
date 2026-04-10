'use client';

import { motion } from 'framer-motion';

interface Transaction {
  id: number;
  description: string;
  amount: number;
  type: string;
  date: string;
  category_id: number;
  categories?: {
    name: string;
    icon: string;
    color: string;
  };
}

const TransactionsTable = ({ transactions }: { transactions: Transaction[] }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="rounded-2xl bg-white p-6 shadow-lg shadow-gray-200/50 border border-gray-100"
    >
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Transactions</h3>
      {transactions.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <p className="text-lg">No transactions yet</p>
          <p className="text-sm mt-1">Add your first transaction above!</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Category
                </th>
              </tr>
            </thead>
            <tbody>
              {transactions.slice(0, 10).map((transaction) => (
                <tr
                  key={transaction.id}
                  className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                >
                  <td className="py-3.5 text-sm text-gray-700 font-medium">
                    {transaction.description}
                  </td>
                  <td className="py-3.5">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-semibold ${
                        transaction.type === 'income'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-rose-50 text-rose-700'
                      }`}
                    >
                      {transaction.type === 'income' ? '+' : '-'}₹
                      {Number(transaction.amount).toLocaleString('en-IN')}
                    </span>
                  </td>
                  <td className="py-3.5 text-sm text-gray-500">
                    {new Date(transaction.date).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </td>
                  <td className="py-3.5">
                    <span
                      className="inline-flex items-center gap-1.5 text-sm text-gray-600"
                    >
                      {transaction.categories?.name && (
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: transaction.categories.color }}
                        />
                      )}
                      {transaction.categories?.name || 'Uncategorized'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  );
};

export default TransactionsTable;