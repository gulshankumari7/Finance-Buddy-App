'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { deleteCategory, addCategory, setBudget } from '@/lib/db/actions';
import { User, Palette, Target, Trash2, Plus, Save } from 'lucide-react';

type Profile = {
  id: string;
  email?: string;
  fullName: string;
  avatarUrl: string;
} | null;

interface Category {
  id: number;
  name: string;
  type: string;
  color: string;
  icon?: string;
}

interface Budget {
  id: number;
  amount: number;
  category_id: number;
  categories?: { name: string; color: string };
}

export default function SettingsClient({
  profile,
  categories,
  budgets,
}: {
  profile: Profile;
  categories: Category[];
  budgets: Budget[];
}) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'profile' | 'categories' | 'budgets'>('profile');
  const [newCat, setNewCat] = useState({ name: '', type: 'expense', color: '#6366f1' });
  const [budgetInputs, setBudgetInputs] = useState<{ [key: number]: string }>(() => {
    const map: { [key: number]: string } = {};
    for (const b of budgets) {
      map[b.category_id] = String(b.amount);
    }
    return map;
  });
  const [saving, setSaving] = useState(false);

  const handleDeleteCategory = async (id: number) => {
    if (!confirm('Delete this category? Transactions using it will become uncategorized.')) return;
    const res = await deleteCategory(id);
    if (!res?.success) alert(res?.error || 'Failed to delete category');
    router.refresh();
  };

  const handleAddCategory = async () => {
    if (!newCat.name.trim()) return;
    const res = await addCategory(newCat);
    if (res?.error) alert(res.error);
    else setNewCat({ name: '', type: 'expense', color: '#6366f1' });
    router.refresh();
  };

  const handleSaveBudget = async (categoryId: number) => {
    const amount = Number(budgetInputs[categoryId]);
    if (!amount || amount <= 0) return;
    setSaving(true);
    await setBudget({ category_id: categoryId, amount });
    setSaving(false);
    router.refresh();
  };

  const expenseCategories = categories.filter((c) => c.type === 'expense');

  const tabs = [
    { key: 'profile' as const, label: 'Profile', icon: User },
    { key: 'categories' as const, label: 'Categories', icon: Palette },
    { key: 'budgets' as const, label: 'Budgets', icon: Target },
  ];

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#1e293b', marginBottom: '8px' }}>Settings</h1>
        <p style={{ fontSize: '15px', color: '#64748b' }}>Manage your profile, categories, and budgets</p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '28px', background: '#f1f5f9', borderRadius: '14px', padding: '4px', width: 'fit-content' }}>
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 20px',
              borderRadius: '10px',
              border: 'none',
              fontSize: '14px',
              fontWeight: activeTab === tab.key ? 600 : 400,
              background: activeTab === tab.key ? 'white' : 'transparent',
              color: activeTab === tab.key ? '#1e293b' : '#64748b',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: activeTab === tab.key ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
            }}
          >
            <tab.icon style={{ width: '16px', height: '16px' }} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* ===== Profile Tab ===== */}
      {activeTab === 'profile' && (
        <div style={{ background: 'white', borderRadius: '16px', padding: '32px', border: '1px solid #f1f5f9', maxWidth: '600px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '28px' }}>
            {profile?.avatarUrl ? (
              <img
                src={profile.avatarUrl}
                alt="Avatar"
                style={{ width: '72px', height: '72px', borderRadius: '50%', border: '3px solid #eef2ff' }}
              />
            ) : (
              <div style={{
                width: '72px', height: '72px', borderRadius: '50%',
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'white', fontSize: '28px', fontWeight: 700,
              }}>
                {profile?.fullName?.charAt(0) || 'U'}
              </div>
            )}
            <div>
              <h3 style={{ fontSize: '20px', fontWeight: 600, color: '#1e293b' }}>{profile?.fullName || 'User'}</h3>
              <p style={{ fontSize: '14px', color: '#64748b' }}>{profile?.email || ''}</p>
            </div>
          </div>

          <div style={{ display: 'grid', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#64748b', marginBottom: '6px' }}>Full Name</label>
              <input
                type="text"
                value={profile?.fullName || ''}
                readOnly
                style={{
                  width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #e2e8f0',
                  fontSize: '14px', color: '#1e293b', background: '#f8fafc',
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#64748b', marginBottom: '6px' }}>Email</label>
              <input
                type="email"
                value={profile?.email || ''}
                readOnly
                style={{
                  width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #e2e8f0',
                  fontSize: '14px', color: '#1e293b', background: '#f8fafc',
                }}
              />
            </div>
            <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>
              Profile information is managed by your Google account.
            </p>
          </div>
        </div>
      )}

      {/* ===== Categories Tab ===== */}
      {activeTab === 'categories' && (
        <div style={{ maxWidth: '700px' }}>
          {/* Add New Category */}
          <div style={{ background: 'white', borderRadius: '16px', padding: '24px', border: '1px solid #f1f5f9', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#1e293b', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Plus style={{ width: '18px', height: '18px' }} />
              Add Category
            </h3>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'end', flexWrap: 'wrap' }}>
              <div style={{ flex: '1 1 180px' }}>
                <label style={{ display: 'block', fontSize: '12px', color: '#64748b', marginBottom: '6px' }}>Name</label>
                <input
                  type="text"
                  value={newCat.name}
                  onChange={(e) => setNewCat({ ...newCat, name: e.target.value })}
                  placeholder="Category name"
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '14px', outline: 'none' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#64748b', marginBottom: '6px' }}>Type</label>
                <select
                  value={newCat.type}
                  onChange={(e) => setNewCat({ ...newCat, type: e.target.value })}
                  style={{ padding: '10px 14px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '14px', cursor: 'pointer', outline: 'none' }}
                >
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#64748b', marginBottom: '6px' }}>Color</label>
                <input
                  type="color"
                  value={newCat.color}
                  onChange={(e) => setNewCat({ ...newCat, color: e.target.value })}
                  style={{ width: '44px', height: '38px', borderRadius: '10px', border: '1px solid #e2e8f0', cursor: 'pointer', padding: '2px' }}
                />
              </div>
              <button
                onClick={handleAddCategory}
                style={{
                  padding: '10px 20px', borderRadius: '10px', border: 'none',
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  color: 'white', fontSize: '14px', fontWeight: 500, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: '6px',
                  boxShadow: '0 2px 8px rgba(99,102,241,0.3)',
                }}
              >
                <Plus style={{ width: '16px', height: '16px' }} />
                Add
              </button>
            </div>
          </div>

          {/* Category List */}
          <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #f1f5f9', overflow: 'hidden' }}>
            {categories.map((cat, i) => (
              <div
                key={cat.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '14px 24px',
                  borderBottom: i < categories.length - 1 ? '1px solid #f8fafc' : 'none',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ width: '12px', height: '12px', borderRadius: '4px', background: cat.color }} />
                  <span style={{ fontSize: '14px', fontWeight: 500, color: '#1e293b' }}>{cat.name}</span>
                  <span style={{
                    fontSize: '11px', padding: '2px 8px', borderRadius: '6px',
                    background: cat.type === 'income' ? '#ecfdf5' : '#fef2f2',
                    color: cat.type === 'income' ? '#10b981' : '#ef4444',
                    fontWeight: 500,
                  }}>
                    {cat.type}
                  </span>
                </div>
                <button
                  onClick={() => handleDeleteCategory(cat.id)}
                  style={{
                    padding: '6px', borderRadius: '8px', border: 'none', background: 'transparent',
                    cursor: 'pointer', color: '#cbd5e1', transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.background = '#fef2f2'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = '#cbd5e1'; e.currentTarget.style.background = 'transparent'; }}
                >
                  <Trash2 style={{ width: '16px', height: '16px' }} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ===== Budgets Tab ===== */}
      {activeTab === 'budgets' && (
        <div style={{ maxWidth: '600px' }}>
          <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #f1f5f9', overflow: 'hidden' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#1e293b' }}>Monthly Budgets</h3>
              <p style={{ fontSize: '13px', color: '#94a3b8', marginTop: '4px' }}>Set spending limits for each expense category</p>
            </div>
            {expenseCategories.length === 0 ? (
              <div style={{ padding: '40px 24px', textAlign: 'center', color: '#94a3b8' }}>
                No expense categories yet
              </div>
            ) : (
              expenseCategories.map((cat, i) => (
                <div
                  key={cat.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    padding: '16px 24px',
                    borderBottom: i < expenseCategories.length - 1 ? '1px solid #f8fafc' : 'none',
                  }}
                >
                  <span style={{ width: '10px', height: '10px', borderRadius: '4px', background: cat.color, flexShrink: 0 }} />
                  <span style={{ fontSize: '14px', fontWeight: 500, color: '#1e293b', width: '120px' }}>{cat.name}</span>
                  <div style={{ position: 'relative', flex: 1 }}>
                    <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', fontSize: '14px', color: '#94a3b8' }}>₹</span>
                    <input
                      type="number"
                      placeholder="0"
                      value={budgetInputs[cat.id] || ''}
                      onChange={(e) => setBudgetInputs({ ...budgetInputs, [cat.id]: e.target.value })}
                      style={{
                        width: '100%', padding: '10px 14px 10px 28px', borderRadius: '10px',
                        border: '1px solid #e2e8f0', fontSize: '14px', outline: 'none', color: '#1e293b',
                      }}
                    />
                  </div>
                  <button
                    onClick={() => handleSaveBudget(cat.id)}
                    disabled={saving}
                    style={{
                      padding: '8px 16px', borderRadius: '10px', border: 'none',
                      background: '#6366f1', color: 'white', fontSize: '13px', fontWeight: 500,
                      cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px',
                      opacity: saving ? 0.6 : 1,
                    }}
                  >
                    <Save style={{ width: '14px', height: '14px' }} />
                    Save
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
