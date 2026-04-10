'use client';

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  PieChart, Pie, Cell,
  AreaChart, Area,
  RadialBarChart, RadialBar,
} from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, PiggyBank } from 'lucide-react';

interface Props {
  chartData: { name: string; income: number; expenses: number; savings: number }[];
  categoryData: { name: string; value: number; color: string }[];
  budgetData: { name: string; budget: number; actual: number }[];
  stats: { income: number; expenses: number; savings: number; balance: number };
}

const fmt = (val: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

export default function AnalyticsClient({ chartData, categoryData, budgetData, stats }: Props) {
  const savingsRate = stats.income > 0 ? ((stats.savings / stats.income) * 100).toFixed(1) : '0';

  return (
    <div>
      {/* Page Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#1e293b', marginBottom: '8px' }}>Analytics</h1>
        <p style={{ fontSize: '15px', color: '#64748b' }}>Insights and trends for your finances</p>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '28px' }}>
        {[
          { label: 'Income', value: fmt(stats.income), icon: TrendingUp, color: '#10b981', bg: '#ecfdf5' },
          { label: 'Expenses', value: fmt(stats.expenses), icon: TrendingDown, color: '#ef4444', bg: '#fef2f2' },
          { label: 'Savings', value: fmt(stats.savings), icon: PiggyBank, color: '#8b5cf6', bg: '#f5f3ff' },
          { label: 'Savings Rate', value: `${savingsRate}%`, icon: DollarSign, color: '#f59e0b', bg: '#fffbeb' },
        ].map((card) => (
          <div
            key={card.label}
            style={{
              background: 'white',
              borderRadius: '16px',
              padding: '20px 24px',
              border: '1px solid #f1f5f9',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
            }}
          >
            <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: card.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <card.icon style={{ width: '24px', height: '24px', color: card.color }} />
            </div>
            <div>
              <p style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '2px' }}>{card.label}</p>
              <p style={{ fontSize: '22px', fontWeight: 700, color: '#1e293b' }}>{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginBottom: '20px' }}>
        {/* Income vs Expense Bar */}
        <div style={{ background: 'white', borderRadius: '16px', padding: '24px', border: '1px solid #f1f5f9' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#1e293b', marginBottom: '20px' }}>Income vs Expenses</h3>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '12px', color: 'white', fontSize: '13px' }}
                  itemStyle={{ color: 'white' }}
                />
                <Legend wrapperStyle={{ fontSize: '13px' }} />
                <Bar dataKey="income" fill="#10b981" radius={[6, 6, 0, 0]} name="Income" />
                <Bar dataKey="expenses" fill="#ef4444" radius={[6, 6, 0, 0]} name="Expenses" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
              Add transactions to see charts
            </div>
          )}
        </div>

        {/* Category Pie */}
        <div style={{ background: 'white', borderRadius: '16px', padding: '24px', border: '1px solid #f1f5f9' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#1e293b', marginBottom: '20px' }}>Expense Categories</h3>
          {categoryData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={categoryData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} dataKey="value" paddingAngle={3} stroke="none">
                    {categoryData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '10px', color: 'white', fontSize: '13px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '12px' }}>
                {categoryData.map((c, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#64748b' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: c.color }} />
                    {c.name}
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div style={{ height: '280px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
              No expense data yet
            </div>
          )}
        </div>
      </div>

      {/* Charts Row 2 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
        {/* Savings Trend */}
        <div style={{ background: 'white', borderRadius: '16px', padding: '24px', border: '1px solid #f1f5f9' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#1e293b', marginBottom: '20px' }}>Savings Trend</h3>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="savingsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '12px', color: 'white', fontSize: '13px' }} />
                <Area type="monotone" dataKey="savings" stroke="#8b5cf6" fill="url(#savingsGrad)" strokeWidth={2.5} dot={{ r: 4, fill: '#8b5cf6' }} />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ height: '250px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
              No data yet
            </div>
          )}
        </div>

        {/* Budget vs Actual */}
        <div style={{ background: 'white', borderRadius: '16px', padding: '24px', border: '1px solid #f1f5f9' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#1e293b', marginBottom: '20px' }}>Budget vs Actual</h3>
          {budgetData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={budgetData} layout="vertical" barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis dataKey="name" type="category" width={80} tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '12px', color: 'white', fontSize: '13px' }} />
                <Legend wrapperStyle={{ fontSize: '13px' }} />
                <Bar dataKey="budget" fill="#6366f1" radius={[0, 6, 6, 0]} name="Budget" />
                <Bar dataKey="actual" fill="#f59e0b" radius={[0, 6, 6, 0]} name="Actual" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ height: '250px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: '14px', textAlign: 'center' }}>
              No budgets set yet.<br />Go to Settings to set budgets.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
