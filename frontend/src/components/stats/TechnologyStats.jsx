import { Code2, Sparkles } from "lucide-react";

export default function TechnologyStats({ technologies, technology_summary }) {
    return (
        <div className="flex flex-col justify-between p-5 gap-5 bg-[#0a0b12]">
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between border-b border-white/12 pb-3">
                    <div className="flex items-center gap-2">
                        <Code2 className="w-4 h-4 text-indigo-400" />
                        <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-white">
                            TECHNOLOGIES
                        </h2>
                    </div>
                    <span className="text-xs font-mono border border-white/12 px-2 py-0.5 bg-white/5 text-slate-400">
                        {technologies?.length || 0}
                    </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-3 gap-2 sm:gap-2.5">
                    {technologies && technologies.length > 0 ? (
                        technologies.map((tech) => (
                            <div
                                key={tech?.id}
                                className="border border-white/10 bg-[#0e101b] hover:bg-indigo-600/15 hover:border-indigo-500/50 transition-colors p-3 flex flex-col items-center justify-center gap-2 text-center group cursor-pointer"
                            >
                                <span className="text-xs font-mono font-medium text-slate-300 uppercase truncate w-full">
                                    {tech?.name}
                                </span>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-3 border border-dashed border-white/10 p-6 text-center text-slate-500 text-xs font-mono">
                            TEXNOLOGIYALAR MAVJUD EMAS
                        </div>
                    )}
                </div>

            </div>

            {
                technology_summary && (
                    <div className="border border-white/12 bg-[#0e101c] p-4 flex flex-col gap-2">
                        <div className="flex items-center gap-2 text-xs font-mono font-bold text-indigo-300 uppercase tracking-wider border-b border-white/10 pb-2">
                            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                            <span>DEVELOPER SUMMARY</span>
                        </div>
                        <p className="text-slate-300 text-xs leading-relaxed font-mono">
                            {technology_summary}
                        </p>
                    </div>
                )
            }
        </div>
    )
}
