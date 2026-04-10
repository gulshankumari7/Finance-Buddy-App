'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { deleteTransaction } from '@/lib/db/actions';
import { Search, Trash2, Filter, ArrowUpRight, ArrowDownRight, Calendar } from 'lucide-react';

interface Transaction {
  id: number;
  description: string;
  amount: number;
  type: string;
  date: string;
  categories?: { name: string; icon: string; color: string } | null;
}

interface Category {
  id: number;
  name: string;
  type: string;
  color: string;
}

export default function TransactionsClient({
  transactions,
  categories,
}: {
  transactions: Transaction[];
  categories: Category[];
}) {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [catFilter, setCatFilter] = useState('all');
  const [deleting, setDeleting] = useState<number | null>(null);

  const filtered = useMemo(() => {
    return transactions.filter((t) => {
      if (search && !t.description.toLowerCase().includes(search.toLowerCase())) return false;
      if (typeFilter !== 'all' && t.type !== typeFilter) return false;
      if (catFilter !== 'all' && t.categories?.name !== catFilter) return false;
      return true;
    });
  }, [transactions, search, typeFilter, catFilter]);

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this transaction?')) return;
    setDeleting(id);
    await deleteTransaction(id);
    router.refresh();
    setDeleting(null);
  };

  const fmt = (val: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

  const totalIncome = filtered.filter((t) => t.type === 'income').reduce((s, t) => s + Number(t.amount), 0);
  const totalExpense = filtered.filter((t) => t.type === 'expense').reduce((s, t) => s + Number(t.amount), 0);

  return (
    <div>
      {/* Page Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#1e293b', marginBottom: '8px' }}>
          Transactions
        </h1>
        <p style={{ fontSize: '15px', color: '#64748b' }}>
          View and manage all your transactions
        </p>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
        <div style={{ background: 'white', borderRadius: '16px', padding: '20px 24px', border: '1px solid #f1f5f9' }}>
          <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '4px' }}>Total Transactions</p>
          <p style={{ fontSize: '28px', fontWeight: 700, color: '#1e293b' }}>{filtered.length}</p>
        </div>
        <div style={{ background: 'white', borderRadius: '16px', padding: '20px 24px', border: '1px solid #f1f5f9' }}>
          <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '4px' }}>Income</p>
          <p style={{ fontSize: '28px', fontWeight: 700, color: '#10b981' }}>{fmt(totalIncome)}</p>
        </div>
        <div style={{ background: 'white', borderRadius: '16px', padding: '20px 24px', border: '1px solid #f1f5f9' }}>
          <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '4px' }}>Expenses</p>
          <p style={{ fontSize: '28px', fontWeight: 700, color: '#ef4444' }}>{fmt(totalExpense)}</p>
        </div>
      </div>

      {/* Filters */}
      <div
        style={{
          display: 'flex',
          gap: '12px',
          marginBottom: '20px',
          flexWrap: 'wrap',
          alignItems: 'center',
        }}
      >
        {/* Search */}
        <div style={{ position: 'relative', flex: '1 1 250px', maxWidth: '360px' }}>
          <Search style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: '#94a3b8' }} />
          <input
            type="text"
            placeholder="Search transactions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 14px 10px 40px',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              fontSize: '14px',
              background: 'white',
              color: '#1e293b',
              outline: 'none',
            }}
          />
        </div>

        {/* Type Filter */}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Filter style={{ width: '16px', height: '16px', color: '#94a3b8' }} />
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            style={{
              padding: '10px 14px',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              fontSize: '14px',
              background: 'white',
              color: '#1e293b',
              cursor: 'pointer',
              outline: 'none',
            }}
          >
            <option value="all">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>

        {/* Category Filter */}
        <select
          value={catFilter}
          onChange={(e) => setCatFilter(e.target.value)}
          style={{
            padding: '10px 14px',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            fontSize: '14px',
            background: 'white',
            color: '#1e293b',
            cursor: 'pointer',
            outline: 'none',
          }}
        >
          <option value="all">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.name}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #f1f5f9', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
              {['Description', 'Category', 'Date', 'Amount', ''].map((h) => (
                <th
                  key={h}
                  style={{
                    padding: '14px 20px',
                    textAlign: 'left',
                    fontSize: '12px',
                    fontWeight: 600,
                    color: '#94a3b8',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '48px 20px', color: '#94a3b8', fontSize: '15px' }}>
                  No transactions found
                </td>
              </tr>
            ) : (
              filtered.map((t) => (
                <tr
                  key={t.id}
                  style={{ borderBottom: '1px solid #f8fafc', transition: 'background 0.15s ease' }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = '#fafbfd'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                >
                  <td style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '10px',
                        background: t.type === 'income' ? '#ecfdf5' : '#fef2f2',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      {t.type === 'income' ? (
                        <ArrowUpRight style={{ width: '18px', height: '18px', color: '#10b981' }} />
                      ) : (
                        <ArrowDownRight style={{ width: '18px', height: '18px', color: '#ef4444' }} />
                      )}
                    </div>
                    <span style={{ fontSize: '14px', fontWeight: 500, color: '#1e293b' }}>{t.description}</span>
                  </td>
                  <td style={{ padding: '16px 20px' }}>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '4px 12px',
                        borderRadius: '8px',
                        fontSize: '13px',
                        fontWeight: 500,
                        background: `${t.categories?.color || '#6b7280'}15`,
                        color: t.categories?.color || '#6b7280',
                      }}
                    >
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: t.categories?.color || '#6b7280' }} />
                      {t.categories?.name || 'Uncategorized'}
                    </span>
                  </td>
                  <td style={{ padding: '16px 20px' }}>
                    <span style={{ fontSize: '14px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Calendar style={{ width: '14px', height: '14px' }} />
                      {new Date(t.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </td>
                  <td style={{ padding: '16px 20px' }}>
                    <span
                      style={{
                        fontSize: '15px',
                        fontWeight: 600,
                        color: t.type === 'income' ? '#10b981' : '#ef4444',
                      }}
                    >
                      {t.type === 'income' ? '+' : '-'}{fmt(Number(t.amount))}
                    </span>
                  </td>
                  <td style={{ padding: '16px 20px' }}>
                    <button
                      onClick={() => handleDelete(t.id)}
                      disabled={deleting === t.id}
                      style={{
                        padding: '8px',
                        borderRadius: '8px',
                        border: 'none',
                        background: 'transparent',
                        cursor: 'pointer',
                        color: '#94a3b8',
                        transition: 'all 0.2s ease',
                        opacity: deleting === t.id ? 0.4 : 1,
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = '#fef2f2'; e.currentTarget.style.color = '#ef4444'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#94a3b8'; }}
                    >
                      <Trash2 style={{ width: '16px', height: '16px' }} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
