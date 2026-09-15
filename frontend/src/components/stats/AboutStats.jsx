import { User } from "lucide-react";

export default function AboutStats({ about }) {
    return (
        <section className="w-full border-x border-b border-white/15 bg-[#0a0b12] p-5 flex flex-col gap-3 font-mono">
            <div className="flex items-center justify-between border-b border-white/12 pb-3">
                <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-indigo-400" />
                    <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-white">
                        ABOUT ME
                    </h2>
                </div>
                <span className="text-[10px] font-mono text-indigo-400 border border-indigo-500/30 px-2 py-0.5 bg-indigo-500/10 uppercase tracking-widest">
                    BIO // INFO
                </span>
            </div>
            <div className="border border-white/12 bg-[#0e101c] p-4 text-xs sm:text-sm text-slate-300 leading-relaxed font-mono whitespace-pre-line">
                {about}
            </div>
        </section>
    )
}