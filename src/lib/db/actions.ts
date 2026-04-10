'use server';

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

async function createSupabaseServer() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );
}

// ===== Default categories to seed for new users =====
const DEFAULT_CATEGORIES = [
  { name: 'Salary', type: 'income', icon: 'briefcase', color: '#10b981' },
  { name: 'Freelance', type: 'income', icon: 'laptop', color: '#06b6d4' },
  { name: 'Investments', type: 'income', icon: 'trending-up', color: '#8b5cf6' },
  { name: 'Food', type: 'expense', icon: 'utensils', color: '#ef4444' },
  { name: 'Transport', type: 'expense', icon: 'bus', color: '#f97316' },
  { name: 'Housing', type: 'expense', icon: 'home', color: '#6366f1' },
  { name: 'Entertainment', type: 'expense', icon: 'film', color: '#ec4899' },
  { name: 'Health', type: 'expense', icon: 'heart', color: '#14b8a6' },
  { name: 'Shopping', type: 'expense', icon: 'shopping-bag', color: '#f59e0b' },
  { name: 'Education', type: 'expense', icon: 'book', color: '#3b82f6' },
  { name: 'Bills', type: 'expense', icon: 'zap', color: '#a855f7' },
  { name: 'Other', type: 'expense', icon: 'ellipsis', color: '#6b7280' },
];

// ===== CATEGORIES =====

export async function getCategories() {
  const supabase = await createSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name');

  if (error) {
    console.error(error);
    return [];
  }

// Auto-seed default categories for new users
  if (!data || data.length === 0) {
    // To prevent race conditions from inserting multiple times, 
    // insert only one default row first. But for simplicity, we just insert all.
    // If duplicates happen, the deduplication block below will catch them on next load.
    const { data: seeded, error: seedErr } = await supabase
      .from('categories')
      .insert(DEFAULT_CATEGORIES.map((cat) => ({ ...cat, user_id: user.id })))
      .select();
      
    if (seedErr) {
      console.error('Seed error:', seedErr);
    }
    return seeded || [];
  }

  // De-duplicate if race conditions created multiples
  const uniqueNames = new Set();
  const duplicates: number[] = [];
  const uniqueData = data.filter(cat => {
    if (uniqueNames.has(cat.name)) {
      duplicates.push(cat.id);
      return false;
    }
    uniqueNames.add(cat.name);
    return true;
  });

  // Clean them up silently in the background
  if (duplicates.length > 0) {
    supabase.from('categories').delete().in('id', duplicates).then();
  }

  return uniqueData;
}

export async function addCategory(category: {
  name: string;
  type: string;
  icon?: string;
  color?: string;
}) {
  const supabase = await createSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { data: null, error: 'Not authenticated' };

  const { data, error } = await supabase
    .from('categories')
    .insert({ ...category, user_id: user.id })
    .select()
    .single();
  if (error) {
    console.error('Failed to add category:', error);
    return { data: null, error: error.message };
  }
  return { data, error: null };
}

export async function deleteCategory(id: number) {
  const supabase = await createSupabaseServer();
  const { error } = await supabase.from('categories').delete().eq('id', id);
  if (error) {
    console.error('Failed to delete category:', error);
    return { success: false, error: error.message };
  }
  return { success: true };
}

// ===== TRANSACTIONS =====

export async function getTransactions(filters?: {
  type?: string;
  category_id?: number;
  search?: string;
  limit?: number;
}) {
  const supabase = await createSupabaseServer();
  let query = supabase
    .from('transactions')
    .select('*, categories(name, icon, color)')
    .order('date', { ascending: false });

  if (filters?.type && filters.type !== 'all') {
    query = query.eq('type', filters.type);
  }
  if (filters?.category_id) {
    query = query.eq('category_id', filters.category_id);
  }
  if (filters?.search) {
    query = query.ilike('description', `%${filters.search}%`);
  }
  if (filters?.limit) {
    query = query.limit(filters.limit);
  }

  const { data, error } = await query;
  if (error) {
    console.error(error);
    return [];
  }
  return data;
}

export async function addTransaction(transaction: {
  description: string;
  amount: number;
  type: string;
  category_id?: number;
  date: Date;
}) {
  const supabase = await createSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase.from('transactions').insert({
    ...transaction,
    user_id: user.id,
  });
  if (error) {
    console.error(error);
    return null;
  }
  return data;
}

export async function deleteTransaction(id: number) {
  const supabase = await createSupabaseServer();
  const { error } = await supabase.from('transactions').delete().eq('id', id);
  if (error) {
    console.error(error);
    return false;
  }
  return true;
}

// ===== STATS =====

export async function getMonthlyStats() {
  const supabase = await createSupabaseServer();
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString();

  const { data: transactions, error } = await supabase
    .from('transactions')
    .select('amount, type')
    .gte('date', startOfMonth)
    .lte('date', endOfMonth);

  if (error) {
    console.error(error);
    return { income: 0, expenses: 0, savings: 0, balance: 0 };
  }

  const income = (transactions || [])
    .filter((t: any) => t.type === 'income')
    .reduce((sum: number, t: any) => sum + Number(t.amount), 0);
  const expenses = (transactions || [])
    .filter((t: any) => t.type === 'expense')
    .reduce((sum: number, t: any) => sum + Number(t.amount), 0);

  return { income, expenses, savings: income - expenses, balance: income - expenses };
}

export async function getMonthlyChartData() {
  const supabase = await createSupabaseServer();
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const { data, error } = await supabase
    .from('transactions')
    .select('amount, type, date')
    .gte('date', sixMonthsAgo.toISOString())
    .order('date');

  if (error) {
    console.error(error);
    return [];
  }

  const monthMap: { [key: string]: { income: number; expenses: number } } = {};
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  for (const t of data || []) {
    const d = new Date(t.date);
    const key = `${monthNames[d.getMonth()]}`;
    if (!monthMap[key]) monthMap[key] = { income: 0, expenses: 0 };
    if (t.type === 'income') monthMap[key].income += Number(t.amount);
    else monthMap[key].expenses += Number(t.amount);
  }

  return Object.entries(monthMap).map(([name, vals]) => ({
    name,
    income: vals.income,
    expenses: vals.expenses,
    savings: vals.income - vals.expenses,
  }));
}

export async function getCategoryExpenses() {
  const supabase = await createSupabaseServer();
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

  const { data, error } = await supabase
    .from('transactions')
    .select('amount, categories(name, color)')
    .eq('type', 'expense')
    .gte('date', startOfMonth);

  if (error) {
    console.error(error);
    return [];
  }

  const catMap: { [key: string]: { value: number; color: string } } = {};
  for (const t of data || []) {
    const catName = (t as any).categories?.name || 'Other';
    const catColor = (t as any).categories?.color || '#8884d8';
    if (!catMap[catName]) catMap[catName] = { value: 0, color: catColor };
    catMap[catName].value += Number(t.amount);
  }

  return Object.entries(catMap).map(([name, vals]) => ({
    name,
    value: vals.value,
    color: vals.color,
  }));
}

export async function getBudgetVsActual() {
  const supabase = await createSupabaseServer();
  const now = new Date();

  const { data: budgets, error: bErr } = await supabase
    .from('budgets')
    .select('amount, categories(name)')
    .eq('month', now.getMonth() + 1)
    .eq('year', now.getFullYear());

  if (bErr) {
    console.error(bErr);
    return [];
  }

  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const { data: transactions, error: tErr } = await supabase
    .from('transactions')
    .select('amount, categories(name)')
    .eq('type', 'expense')
    .gte('date', startOfMonth);

  if (tErr) {
    console.error(tErr);
    return [];
  }

  const actualMap: { [key: string]: number } = {};
  for (const t of transactions || []) {
    const name = (t as any).categories?.name || 'Other';
    actualMap[name] = (actualMap[name] || 0) + Number(t.amount);
  }

  return (budgets || []).map((b: any) => ({
    name: b.categories?.name || 'Unknown',
    budget: Number(b.amount),
    actual: actualMap[b.categories?.name] || 0,
  }));
}

// ===== USER PROFILE =====

export async function getUserProfile() {
  const supabase = await createSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  return {
    id: user.id,
    email: user.email,
    fullName: user.user_metadata?.full_name || user.user_metadata?.name || '',
    avatarUrl: user.user_metadata?.avatar_url || user.user_metadata?.picture || '',
  };
}

// ===== BUDGETS =====

export async function getBudgets() {
  const supabase = await createSupabaseServer();
  const now = new Date();
  const { data, error } = await supabase
    .from('budgets')
    .select('*, categories(name, icon, color)')
    .eq('month', now.getMonth() + 1)
    .eq('year', now.getFullYear());

  if (error) {
    console.error(error);
    return [];
  }
  return data || [];
}

export async function setBudget(budget: {
  category_id: number;
  amount: number;
}) {
  const supabase = await createSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const now = new Date();
  const { data, error } = await supabase
    .from('budgets')
    .upsert(
      {
        user_id: user.id,
        category_id: budget.category_id,
        amount: budget.amount,
        month: now.getMonth() + 1,
        year: now.getFullYear(),
      },
      { onConflict: 'user_id,category_id,month,year' }
    )
    .select()
    .single();

  if (error) {
    console.error(error);
    return null;
  }
  return data;
}
