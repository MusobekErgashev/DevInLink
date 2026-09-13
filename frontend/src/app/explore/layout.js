'use client';

import React, { useState } from 'react';
import { Search, X, SlidersHorizontal } from 'lucide-react';

export default function ExploreLayout({ children }) {
  const [searchValue, setSearchValue] = useState('');

  return (
    <div className="h-full w-full flex flex-col gap-5 min-w-0 overflow-hidden font-inter">
      {/* Top Container above children */}
      <div className="w-full rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.4)] border border-white/10 backdrop-blur-2xl flex items-center justify-between px-4 py-3 shrink-0 relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute -top-12 left-1/4 w-96 h-12 bg-indigo-500/10 blur-2xl pointer-events-none rounded-full" />

        {/* Search Input Box */}
        <div className="flex items-center gap-3 flex-1 max-w-2xl z-10">
          <div className="group relative w-full flex items-center">
            <Search className="w-4.5 h-4.5 absolute left-3.5 text-slate-400 group-focus-within:text-indigo-400 transition-colors duration-200 pointer-events-none" />
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Dasturchilarni qidirish..."
              className="w-full bg-white/[0.04] hover:bg-white/[0.07] focus:bg-white/[0.08] border border-white/10 focus:border-indigo-500/50 rounded-xl pl-10 pr-12 py-3 text-sm text-slate-100 placeholder:text-slate-400 focus:outline-none transition-all duration-200 font-medium"
            />
            {searchValue && (
              <button
                type="button"
                onClick={() => setSearchValue('')}
                className="absolute right-3 p-1 rounded-md text-slate-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Right Action Items */}
        <div className="flex items-center gap-2 z-10">
          <button className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-slate-300 hover:text-white transition-all duration-200 text-xs font-semibold cursor-pointer group">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-400 transition-colors" />
            <span>Filtrlar</span>
          </button>
        </div>
      </div>

      {/* Main Content Container (children) */}
      <div className="h-full w-full flex-1 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.4)] border border-white/8 backdrop-blur-xl overflow-hidden overflow-y-auto scrollbar-none">
        {children}
      </div>
    </div>
  );
}
