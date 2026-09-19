import { Award, Briefcase, Building2 } from "lucide-react";

export default function ExperienceStats({ formatDate, experience, totalExperienceYears }) {
    return (
        <div className="flex flex-col justify-between p-5 gap-5 bg-[#0a0b12]">
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between border-b border-white/12 pb-3">
                    <div className="flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-indigo-400" />
                        <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-white">
                            EXPERIENCE
                        </h2>
                    </div>
                    <span className="text-xs font-mono border border-white/12 px-2 py-0.5 bg-white/5 text-slate-400">
                        {experience?.length || 0} JOBS
                    </span>
                </div>

                <div className="flex flex-col gap-3">
                    {experience && experience.length > 0 ? (
                        experience.map((exp) => (
                            <div
                                key={exp?.id}
                                className="border border-white/12 bg-[#0e101b] hover:border-indigo-500/40 p-4 flex flex-col gap-2.5 transition-colors"
                            >
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                                    <h3 className="text-xs font-mono font-bold uppercase text-white tracking-wider">
                                        {exp?.company_name}
                                    </h3>
                                    <span className="text-[10px] font-mono text-indigo-300 border border-indigo-500/30 px-2 py-0.5 bg-indigo-500/10 w-fit">
                                        {formatDate(exp?.start_date)} - {formatDate(exp?.end_date)}
                                    </span>
                                </div>

                                <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
                                    <Building2 className="w-3.5 h-3.5 text-indigo-400" />
                                    <span>{exp?.position}</span>
                                    {exp?.location && (
                                        <>
                                            <span>•</span>
                                            <span>{exp?.location}</span>
                                        </>
                                    )}
                                </div>

                                {exp?.description && (
                                    <p className="text-slate-300 text-xs leading-relaxed font-mono">
                                        {exp?.description}
                                    </p>
                                )}

                                {exp?.technologies && exp?.technologies.length > 0 && (
                                    <div className="flex flex-wrap gap-1.5 mt-1">
                                        {exp?.technologies.map((t, idx) => (
                                            <span
                                                key={idx}
                                                className="px-2 py-0.5 border border-white/10 text-[10px] font-mono bg-white/5 text-slate-300 uppercase"
                                            >
                                                {t}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className="border border-dashed border-white/10 p-6 text-center text-slate-500 text-xs font-mono">
                            ISH TAJRIBASI YO&apos;Q
                        </div>
                    )}
                </div>

            </div>

            <div className="border border-white/12 bg-[#0e101c] p-4 flex flex-col gap-2">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-indigo-300 uppercase tracking-wider border-b border-white/10 pb-2">
                    <Award className="w-3.5 h-3.5 text-indigo-400" />
                    <span>CAREER METRICS</span>
                </div>
                <div className="flex items-center justify-between text-xs font-mono text-slate-300">
                    <span>Umumiy tajriba:</span>
                    <span>{totalExperienceYears === 0 ? 'tajribasiz' : `${totalExperienceYears * 10 < 10 ? `${totalExperienceYears * 10}+ oy` : `${totalExperienceYears} yil`}`}</span>
                </div>
            </div>
        </div>
    )
}