import { getUserProfile, getCategories, getBudgets } from '@/lib/db/actions';
import SettingsClient from '@/components/settings/SettingsClient';

export default async function SettingsPage() {
  const [profile, categories, budgets] = await Promise.all([
    getUserProfile(),
    getCategories(),
    getBudgets(),
  ]);

  return (
    <SettingsClient
      profile={profile}
      categories={categories}
      budgets={budgets}
    />
  );
}
