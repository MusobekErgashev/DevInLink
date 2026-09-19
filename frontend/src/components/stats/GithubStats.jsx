import React, { useState, useEffect, useCallback } from "react";
import { GitHubCalendar } from "react-github-calendar";
import { ExternalLink, GitCommit, Zap, Flame, FolderGit2, Activity, GitBranch } from "lucide-react";
import Link from "next/link";

export default function GitHubStats({ username }) {
  const [stats, setStats] = useState({ total: 0, max: 0, activeDays: 0, streak: 0 });
  const [repoCount, setRepoCount] = useState(null);

  useEffect(() => {
    if (!username) return;
    let isMounted = true;
    fetch(`https://api.github.com/users/${encodeURIComponent(username)}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`GitHub API HTTP ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        if (isMounted && typeof data?.public_repos === "number") {
          setRepoCount(data.public_repos);
        }
      })
      .catch(() => {
        if (isMounted) setRepoCount(null);
      });
    return () => {
      isMounted = false;
    };
  }, [username]);

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

      queueMicrotask(() => {
        setStats((prev) => {
          if (prev.total === total && prev.max === max && prev.activeDays === activeDays && prev.streak === maxStreak) {
            return prev;
          }
          return { total, max, activeDays, streak: maxStreak };
        });
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

      <div className="w-full flex flex-col md:flex-row gap-5 justify-between items-center py-2 relative z-10">
        <div className="grid grid-rows-2 gap-3 w-full md:max-w-110 min-w-max">
          <div className="bg-[#0e101c] border border-white/10 p-3.5 flex flex-col gap-1 relative overflow-hidden group hover:border-emerald-500/40 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">JAMI FAOLLIK</span>
              <GitCommit className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-xl font-bold text-white tracking-tight mt-0.5">
              {stats.total || '—'}
            </div>
            <span className="text-[10px] text-slate-500">O&apos;tgan 1 yilda</span>
          </div>

          <div className="bg-[#0e101c] border border-white/10 p-3.5 flex flex-col gap-1 relative overflow-hidden group hover:border-indigo-500/40 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">REPOZITORIYLAR</span>
              <GitBranch className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="text-xl font-bold text-white tracking-tight mt-0.5">
              {repoCount !== null ? `${repoCount} ta` : '—'}
            </div>
            <span className="text-[10px] text-slate-500">
              Ochiq repozitoriylar
            </span>
          </div>
        </div>

        <GitHubCalendar
          username={username}
          colorScheme="dark"
          theme={theme}
          fontSize={12}
          blockSize={15}
          blockMargin={5}
          transformData={handleTransformData}
          labels={{
            totalCount: "{{count}} ta faollik o'tgan yilda",
          }}
          style={{
            overflow: "hidden",
            color: '#94a3b8',
            fontFamily: 'monospace',
          }}
        />
      </div>
    </section>
  );
}