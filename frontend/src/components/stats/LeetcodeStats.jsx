import { Code2, ExternalLink, Sparkles } from "lucide-react";
import Link from "next/link";

export default function LeetCodeStats({ leetcodeStats, leetcodeLoading }) {
    return (
        <section className="w-full border-x border-b border-white/15 bg-[#0b0c14] p-5 sm:p-6 flex flex-col gap-5 font-mono">
            <div className="flex flex-wrap items-center justify-between border-b border-white/12 pb-4 gap-3">
                <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 bg-amber-500/10 border border-amber-500/30 flex items-center justify-center rounded-sm">
                        <Code2 className="w-4 h-4 text-amber-400" />
                    </div>
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                            <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-white">
                                LEETCODE STATS
                            </h2>
                            {leetcodeStats?.leetcode_username && (
                                <span className="text-[11px] text-amber-400 font-semibold">
                                    @{leetcodeStats.leetcode_username}
                                </span>
                            )}
                        </div>
                        <span className="text-[10px] text-slate-400">
                            ALGORITMLAR VA MASALALAR HAL QILISH STATISTIKASI
                        </span>
                    </div>
                </div>

                {leetcodeStats?.leetcode_username && (
                    <Link
                        href={`https://leetcode.com/u/${leetcodeStats.leetcode_username}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs transition-colors"
                    >
                        <span className="translate-y-0.25">PROFILNI KO&apos;RISH</span>
                        <ExternalLink className="w-3.5 h-3.5 -translate-y-0.25" />
                    </Link>
                )}
            </div>

            {leetcodeLoading ? (
                <div className="p-8 border border-dashed border-white/10 text-center text-slate-400 text-xs animate-pulse">
                    LEETCODE STATISTIKASI YUKLANMOQDA...
                </div>
            ) : leetcodeStats ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    {/* TOTAL SOLVED & RANKING */}
                    <div className="border border-white/12 bg-[#0e101c] p-4 flex flex-col justify-between gap-3 relative overflow-hidden group hover:border-amber-500/40 transition-colors">
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-slate-400 uppercase tracking-wider">YECHILGAN MASALALAR</span>
                            <Sparkles className="w-4 h-4 text-amber-400" />
                        </div>
                        <div>
                            <div className="text-3xl font-extrabold text-white font-mono tracking-tight">
                                {leetcodeStats.totalSolved}
                            </div>
                            <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                                <span>Reyting:</span>
                                <span className="text-amber-400 font-bold">#{leetcodeStats.ranking ? leetcodeStats.ranking.toLocaleString() : 'N/A'}</span>
                            </div>
                        </div>
                        {/* Overall accuracy / progress bar */}
                        <div className="w-full bg-white/10 h-1.5 overflow-hidden flex">
                            <div style={{ width: `${Math.round(((leetcodeStats.easySolved || 0) / (leetcodeStats.totalSolved || 1)) * 100)}%` }} className="bg-emerald-400 h-full" />
                            <div style={{ width: `${Math.round(((leetcodeStats.mediumSolved || 0) / (leetcodeStats.totalSolved || 1)) * 100)}%` }} className="bg-amber-400 h-full" />
                            <div style={{ width: `${Math.round(((leetcodeStats.hardSolved || 0) / (leetcodeStats.totalSolved || 1)) * 100)}%` }} className="bg-rose-400 h-full" />
                        </div>
                    </div>

                    {/* EASY SOLVED */}
                    <div className="border border-emerald-500/20 bg-emerald-950/10 p-4 flex flex-col justify-between gap-3 hover:border-emerald-500/40 transition-colors">
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-emerald-400 font-bold uppercase tracking-wider">EASY</span>
                            <span className="text-[10px] px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                {Math.round(((leetcodeStats.easySolved || 0) / (leetcodeStats.totalSolved || 1)) * 100)}%
                            </span>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-white font-mono">
                                {leetcodeStats.easySolved}
                            </div>
                            <div className="w-full bg-emerald-950/50 h-1.5 mt-2 overflow-hidden border border-emerald-500/20">
                                <div style={{ width: `${Math.round(((leetcodeStats.easySolved || 0) / (leetcodeStats.totalSolved || 1)) * 100)}%` }} className="bg-emerald-400 h-full transition-all duration-500" />
                            </div>
                        </div>
                    </div>

                    {/* MEDIUM SOLVED */}
                    <div className="border border-amber-500/20 bg-amber-950/10 p-4 flex flex-col justify-between gap-3 hover:border-amber-500/40 transition-colors">
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-amber-400 font-bold uppercase tracking-wider">MEDIUM</span>
                            <span className="text-[10px] px-2 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/30">
                                {Math.round(((leetcodeStats.mediumSolved || 0) / (leetcodeStats.totalSolved || 1)) * 100)}%
                            </span>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-white font-mono">
                                {leetcodeStats.mediumSolved}
                            </div>
                            <div className="w-full bg-amber-950/50 h-1.5 mt-2 overflow-hidden border border-amber-500/20">
                                <div style={{ width: `${Math.round(((leetcodeStats.mediumSolved || 0) / (leetcodeStats.totalSolved || 1)) * 100)}%` }} className="bg-amber-400 h-full transition-all duration-500" />
                            </div>
                        </div>
                    </div>

                    {/* HARD SOLVED */}
                    <div className="border border-rose-500/20 bg-rose-950/10 p-4 flex flex-col justify-between gap-3 hover:border-rose-500/40 transition-colors">
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-rose-400 font-bold uppercase tracking-wider">HARD</span>
                            <span className="text-[10px] px-2 py-0.5 bg-rose-500/20 text-rose-300 border border-rose-500/30">
                                {Math.round(((leetcodeStats.hardSolved || 0) / (leetcodeStats.totalSolved || 1)) * 100)}%
                            </span>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-white font-mono">
                                {leetcodeStats.hardSolved}
                            </div>
                            <div className="w-full bg-rose-950/50 h-1.5 mt-2 overflow-hidden border border-rose-500/20">
                                <div style={{ width: `${Math.round(((leetcodeStats.hardSolved || 0) / (leetcodeStats.totalSolved || 1)) * 100)}%` }} className="bg-rose-400 h-full transition-all duration-500" />
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="p-6 border border-dashed border-white/10 text-center text-slate-500 text-xs font-mono">
                    LEETCODE PROFILI BIRIKTIRILMAGAN
                </div>
            )}
        </section>
    )
}