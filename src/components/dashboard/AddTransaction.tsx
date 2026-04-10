'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { addTransaction } from '@/lib/db/actions';
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';

const transactionSchema = z.object({
  description: z.string().min(1, 'Description is required'),
  amount: z.number().positive('Amount must be positive'),
  type: z.enum(['income', 'expense']),
  category_id: z.number().optional(),
});

type TransactionFormValues = z.infer<typeof transactionSchema>;

interface Category {
  id: number;
  name: string;
  type: string;
  icon: string;
  color: string;
}

const AddTransaction = ({ categories }: { categories: Category[] }) => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: { type: 'expense' },
  });

  const selectedType = watch('type');
  const filteredCategories = categories.filter((c) => c.type === selectedType);

  const onSubmit = async (data: TransactionFormValues) => {
    await addTransaction({ ...data, date: new Date() });
    reset();
    router.refresh();
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="rounded-2xl bg-white p-6 shadow-lg shadow-gray-200/50 border border-gray-100"
    >
      <h3 className="text-lg font-semibold text-gray-800 mb-5 flex items-center gap-2">
        <div className="rounded-lg bg-indigo-500 p-1.5">
          <Plus className="w-4 h-4 text-white" />
        </div>
        Add Transaction
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block mb-1.5 text-sm font-medium text-gray-600">
            Description
          </label>
          <input
            {...register('description')}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-gray-800 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all"
            placeholder="e.g., Grocery shopping"
          />
          {errors.description && (
            <p className="text-rose-500 text-xs mt-1">{errors.description.message}</p>
          )}
        </div>
        <div>
          <label className="block mb-1.5 text-sm font-medium text-gray-600">
            Amount (₹)
          </label>
          <input
            type="number"
            {...register('amount', { valueAsNumber: true })}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-gray-800 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all"
            placeholder="0.00"
          />
          {errors.amount && (
            <p className="text-rose-500 text-xs mt-1">{errors.amount.message}</p>
          )}
        </div>
        <div>
          <label className="block mb-1.5 text-sm font-medium text-gray-600">Type</label>
          <select
            {...register('type')}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-gray-800 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all"
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </div>
        <div>
          <label className="block mb-1.5 text-sm font-medium text-gray-600">
            Category
          </label>
          <select
            {...register('category_id', { valueAsNumber: true })}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-gray-800 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all"
          >
            <option value="">Select category</option>
            {filteredCategories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-5 py-2.5 px-6 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium rounded-xl hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all shadow-lg shadow-indigo-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Adding...' : 'Add Transaction'}
      </button>
    </form>
  );
};

export default AddTransaction;
