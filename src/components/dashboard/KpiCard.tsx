'use client';

import { TrendingUp, TrendingDown, Wallet, PiggyBank } from 'lucide-react';
import { motion } from 'framer-motion';

interface KpiCardProps {
  title: string;
  value: string;
  icon?: string;
  trend?: 'up' | 'down';
  color?: 'blue' | 'green' | 'red' | 'purple';
}

const colorMap = {
  blue: {
    bg: 'bg-blue-50',
    icon: 'bg-blue-500',
    text: 'text-blue-600',
  },
  green: {
    bg: 'bg-emerald-50',
    icon: 'bg-emerald-500',
    text: 'text-emerald-600',
  },
  red: {
    bg: 'bg-rose-50',
    icon: 'bg-rose-500',
    text: 'text-rose-600',
  },
  purple: {
    bg: 'bg-violet-50',
    icon: 'bg-violet-500',
    text: 'text-violet-600',
  },
};

const IconComponent = ({ icon }: { icon?: string }) => {
  const className = 'w-6 h-6 text-white';
  switch (icon) {
    case 'wallet':
      return <Wallet className={className} />;
    case 'trending-up':
      return <TrendingUp className={className} />;
    case 'trending-down':
      return <TrendingDown className={className} />;
    case 'piggy-bank':
      return <PiggyBank className={className} />;
    default:
      return <Wallet className={className} />;
  }
};

const KpiCard = ({ title, value, icon, trend, color = 'blue' }: KpiCardProps) => {
  const colors = colorMap[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-lg shadow-gray-200/50 border border-gray-100 hover:shadow-xl transition-shadow duration-300"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`rounded-xl ${colors.icon} p-3 shadow-lg`}>
          <IconComponent icon={icon} />
        </div>
      </div>
      {trend && (
        <div className="mt-3 flex items-center gap-1">
          {trend === 'up' ? (
            <TrendingUp className={`w-4 h-4 ${colors.text}`} />
          ) : (
            <TrendingDown className="w-4 h-4 text-rose-500" />
          )}
          <span className={`text-xs font-medium ${trend === 'up' ? colors.text : 'text-rose-500'}`}>
            This month
          </span>
        </div>
      )}
      {/* Decorative gradient blob */}
      <div
        className={`absolute -top-4 -right-4 h-24 w-24 rounded-full ${colors.bg} opacity-60 blur-2xl`}
      />
    </motion.div>
  );
};

export default KpiCard;