'use client';

import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/db/supabase';

const Header = () => {
  const [profile, setProfile] = useState<{name: string, email: string, avatar: string} | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setProfile({
          name: user.user_metadata?.full_name || user.user_metadata?.name || 'User',
          email: user.email || '',
          avatar: user.user_metadata?.avatar_url || user.user_metadata?.picture || ''
        });
      }
    });
  }, []);

  return (
    <header className="flex items-center justify-between px-8 py-4 bg-white border-b border-gray-100 shadow-sm">
      <div className="flex items-center gap-4">
        <h2 className="text-xl font-bold text-gray-800">Dashboard</h2>
      </div>
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            className="w-64 py-2.5 pl-10 pr-4 text-sm text-gray-700 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 focus:bg-white transition-all"
            placeholder="Search transactions..."
          />
        </div>

        {/* User Avatar */}
        <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
          {profile?.avatar ? (
            <img 
              src={profile.avatar} 
              alt="Avatar" 
              className="w-9 h-9 rounded-full border border-gray-200 shadow-sm"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-semibold text-sm shadow-md">
              {profile?.name ? profile.name.charAt(0) : 'U'}
            </div>
          )}
          <div className="hidden md:block">
            <p className="text-sm font-semibold text-gray-700">{profile?.name || 'Loading...'}</p>
            <p className="text-xs text-gray-400 max-w-[150px] truncate">{profile?.email || '...'}</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
