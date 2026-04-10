import { predictExpenses } from '@/lib/prediction/prediction';
import { Sparkles } from 'lucide-react';

const PredictionCard = async () => {
  const predictedExpenses = await predictExpenses();
  const hasData = Object.keys(predictedExpenses).length > 0;

  return (
    <div className="rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 p-6 shadow-lg shadow-indigo-500/25 text-white">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Sparkles className="w-5 h-5" />
        AI Predictions
      </h3>
      <p className="text-xs text-indigo-200 mb-4">
        Predicted expenses for next month
      </p>
      {hasData ? (
        <ul className="space-y-2.5">
          {Object.entries(predictedExpenses).map(([category, amount]) => (
            <li
              key={category}
              className="flex justify-between items-center py-2 px-3 rounded-xl bg-white/10 backdrop-blur-sm"
            >
              <span className="text-sm text-indigo-100">Category {category}</span>
              <span className="font-semibold text-sm">
                ₹{amount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-center py-6 text-indigo-200">
          <p className="text-sm">Not enough data yet</p>
          <p className="text-xs mt-1">Add more transactions to get predictions</p>
        </div>
      )}
    </div>
  );
};

export default PredictionCard;
