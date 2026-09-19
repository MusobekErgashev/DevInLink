'use client';

import React, { Suspense } from 'react';
import { Search, X, SlidersHorizontal, UserRoundSearch, Sparkles } from 'lucide-react';
import useQueryStore from '@/utils/query.store';

function SearchHeader() {
  const query = useQueryStore((state) => state.query);
  const setQuery = useQueryStore((state) => state.setQuery);
  const resetQuery = useQueryStore((state) => state.resetQuery);

  return (
    <div className="w-full shadow-[0_20px_50px_rgba(0,0,0,0.4)] border border-white/10 backdrop-blur-2xl flex items-center justify-between px-4 py-3 shrink-0 relative overflow-hidden">
      <div className="absolute -top-12 left-1/4 w-96 h-12 bg-indigo-500/10 blur-2xl pointer-events-none rounded-full" />

      <div className="flex items-center gap-3 flex-1 max-w-2xl z-10">
        <div className="group relative w-full flex items-center">
          <Search className="w-4.5 h-4.5 absolute left-3.5 text-slate-400 group-focus-within:text-indigo-400 transition-colors duration-200 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Qidirish (ism, familiya, username)..."
            className="w-full bg-white/[0.04] hover:bg-white/[0.07] focus:bg-white/[0.08] border border-white/10 focus:border-indigo-500/50 rounded-xl pl-10 pr-12 py-2 text-sm text-slate-100 placeholder:text-slate-400 focus:outline-none transition-all duration-200 font-medium"
          />
          {query && (
            <button
              type="button"
              onClick={resetQuery}
              className="absolute right-3 p-1 rounded-md text-slate-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      <div className="flex ml-2 items-center gap-2 z-10 bg-white/5 border h-full border-white/12 p-2 px-4">
        <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-400" />
      </div>
    </div>
  );
}

export default function ExploreLayout({ children }) {
  const totalUsers = useQueryStore((state) => state.total);
  const query = useQueryStore((state) => state.query);

  return (
    <div className="h-full w-full flex flex-col min-w-0 overflow-hidden font-inter">
      <Suspense fallback={
        <div className="w-full rounded-2xl border border-white/10 p-4 bg-white/5 animate-pulse h-14" />
      }>
        <SearchHeader />
      </Suspense>

      <div className="h-full w-full bg-background flex flex-col gap-2 sm:gap-4 flex-1 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.4)] p-2 sm:p-4 backdrop-blur-xl">
        <div className='border py-2.5 sm:py-4 px-3 sm:px-5 border-white/8 bg-[#0e101c] flex items-center justify-between rounded-xl shadow-2xl'>
          <div className='text-xs text-slate-400 font-bold font-mono uppercase tracking-widest flex items-center gap-2'>
            {query.length > 0 ? (
              <UserRoundSearch size={20} />
            ) : (
              <Sparkles size={20} />
            )}
            <span>{query.length > 0 ? `Qidiruv natijalari : ${query}` : 'Tavsiyalar'}</span>
          </div>
          <div className="text-xs text-slate-400 font-bold font-mono uppercase tracking-widest">natija: {totalUsers} ta</div>
        </div>

        <div className="overflow-hidden overflow-y-auto scrollbar-none">
          {children}
        </div>
      </div>
    </div>
  );
}