import React, { useState, useCallback } from "react";
import { GitHubCalendar } from "react-github-calendar";
import { ExternalLink, GitCommit, Zap, Flame, Calendar, Activity } from "lucide-react";
import Link from "next/link";

export default function GitHubStats({ username }) {
  const [stats, setStats] = useState({ total: 0, max: 0, activeDays: 0, streak: 0 });

  const handleTransformData = useCallback((contributions) => {
    if (Array.isArray(contributions) && contributions.length > 0) {
      let total = 0;
      let max = 0;
      let activeDays = 0;
      let currentStreak = 0;
      let maxStreak = 0;

      contributions.forEach((day) => {
        const count = day.count || 0;
        total += count;
        if (count > max) max = count;
        if (count > 0) {
          activeDays++;
          currentStreak++;
          if (currentStreak > maxStreak) maxStreak = currentStreak;
        } else {
          currentStreak = 0;
        }
      });

      setStats((prev) => {
        if (prev.total === total && prev.max === max && prev.activeDays === activeDays && prev.streak === maxStreak) {
          return prev;
        }
        return { total, max, activeDays, streak: maxStreak };
      });
    }
    return contributions;
  }, []);

  if (!username) {
    return (
      <section className="w-full border-x border-b border-white/15 bg-[#0b0c14] p-5 sm:p-6 flex flex-col gap-3 font-mono">
        <div className="p-6 border border-dashed border-white/10 text-center text-slate-500 text-xs font-mono">
          GITHUB PROFILI BIRIKTIRILMAGAN
        </div>
      </section>
    );
  }

  const theme = {
    dark: ['#141726', '#064e3b', '#047857', '#10b981', '#34d399'],
  };

  return (
    <section className="w-full border-x border-b border-white/15 bg-[#0b0c14] p-5 sm:p-6 flex flex-col gap-5 font-mono">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between border-b border-white/12 pb-4 gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center rounded-sm">
            <GitCommit className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-white">
                GITHUB CONTRIBUTIONS
              </h2>
              <span className="text-[11px] text-emerald-400 font-semibold">
                @{username}
              </span>
            </div>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider">
              KOD AMALIYOTI VA REPOZITORIY FAOLLIGI
            </span>
          </div>
        </div>

        <Link
          href={`https://github.com/${username}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs transition-colors"
        >
          <span className="translate-y-0.25">PROFILNI KO&apos;RISH</span>
          <ExternalLink className="w-3.5 h-3.5 -translate-y-0.25" />
        </Link>
      </div>

      {/* GitHub Activity Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-[#06070b] border border-white/10 p-3.5 flex flex-col gap-1 relative overflow-hidden group hover:border-emerald-500/40 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">JAMI FAOLLIK</span>
            <GitCommit className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl font-bold text-white tracking-tight mt-0.5">
            {stats.total || '—'}
          </div>
          <span className="text-[10px] text-slate-500">O&apos;tgan 1 yilda</span>
        </div>

        <div className="bg-[#06070b] border border-white/10 p-3.5 flex flex-col gap-1 relative overflow-hidden group hover:border-indigo-500/40 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">FAOL KUNLAR</span>
            <Calendar className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-xl font-bold text-white tracking-tight mt-0.5">
            {stats.activeDays ? `${stats.activeDays} kun` : '—'}
          </div>
          <span className="text-[10px] text-slate-500">
            {stats.activeDays ? `${Math.round((stats.activeDays / 365) * 100)}% yillik nisbat` : 'Nisbat'}
          </span>
        </div>

        <div className="bg-[#06070b] border border-white/10 p-3.5 flex flex-col gap-1 relative overflow-hidden group hover:border-amber-500/40 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">KUNLIK REKORD</span>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-xl font-bold text-white tracking-tight mt-0.5">
            {stats.max ? `${stats.max} commit` : '—'}
          </div>
          <span className="text-[10px] text-slate-500">Bir kunlik eng ko&apos;p</span>
        </div>

        <div className="bg-[#06070b] border border-white/10 p-3.5 flex flex-col gap-1 relative overflow-hidden group hover:border-rose-500/40 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">MAX STREAK</span>
            <Flame className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-xl font-bold text-white tracking-tight mt-0.5">
            {stats.streak ? `${stats.streak} kun` : '—'}
          </div>
          <span className="text-[10px] text-slate-500">Uzluksiz faollik</span>
        </div>
      </div>

      {/* Calendar Matrix Container with Wireframe styling */}
      <div className="border border-white/12 bg-[#06070b] relative p-4 sm:p-5 flex flex-col justify-center items-center w-full overflow-hidden">
        {/* Background Grid Accent */}
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.05)_1px,transparent_1px)] bg-size-[16px_16px] pointer-events-none" />

        {/* Top Wireframe Bar */}
        <div className="w-full flex items-center justify-between border-b border-white/10 pb-2.5 mb-3 text-[10px] text-slate-400 uppercase tracking-widest relative z-10">
          <div className="flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            <span>GIT_ACTIVITY_MATRIX // 52_WEEKS</span>
          </div>
          <div className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>LIVE SYNC</span>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="overflow-x-auto w-full flex justify-center items-center py-2 relative z-10">
          <GitHubCalendar
            username={username}
            colorScheme="dark"
            theme={theme}
            fontSize={12}
            blockSize={14}
            blockMargin={4}
            transformData={handleTransformData}
            labels={{
              totalCount: "{{count}} ta faollik o'tgan yilda",
            }}
            style={{
              color: '#94a3b8',
              fontFamily: 'monospace',
            }}
          />
        </div>

        {/* Corner Decor Ticks */}
        <span className="absolute top-1.5 left-2 text-slate-600 font-mono text-[10px] pointer-events-none">+</span>
        <span className="absolute top-1.5 right-2 text-slate-600 font-mono text-[10px] pointer-events-none">+</span>
        <span className="absolute bottom-1.5 left-2 text-slate-600 font-mono text-[10px] pointer-events-none">+</span>
        <span className="absolute bottom-1.5 right-2 text-slate-600 font-mono text-[10px] pointer-events-none">+</span>
      </div>
    </section>
  );
}