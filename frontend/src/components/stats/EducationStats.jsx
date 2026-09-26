import { BookOpen, GraduationCap } from "lucide-react";

export default function EducationStats({ formatDate, education }) {
    return (
        <div className="flex flex-col justify-between p-5 gap-5 bg-[#0a0b12]">
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between border-b border-white/12 pb-3">
                    <div className="flex items-center gap-2">
                        <GraduationCap className="w-4 h-4 text-indigo-400" />
                        <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-white">
                            EDUCATION
                        </h2>
                    </div>
                    <span className="text-xs font-mono border border-white/12 px-2 py-0.5 bg-white/5 text-slate-400">
                        {education?.length || 0}
                    </span>
                </div>

                <div className="flex flex-col gap-3">
                    {education && education.length > 0 ? (
                        education.map((item) => (
                            <div
                                key={item?.id}
                                className="border border-white/12 bg-[#0e101b] hover:border-indigo-500/40 p-4 flex flex-col gap-2.5 transition-colors"
                            >
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.25">
                                    <h3 className="text-xs font-mono font-bold uppercase text-white tracking-wider">
                                        {item?.education_place || 'AKADEMIYA / O&apos;QUV MARKAZI'}
                                    </h3>
                                    <span className="text-[10px] font-mono text-purple-300 border border-purple-500/30 px-2 py-0.5 bg-purple-500/10 w-fit">
                                        {formatDate(item?.start_date)} - {formatDate(item?.end_date)}
                                    </span>
                                </div>

                                <div className="flex items-center gap-x-2 flex-wrap gap-y-0.75 text-[11px] font-mono text-slate-400">
                                    <GraduationCap className="w-3.5 h-3.5 text-purple-400" />
                                    <span>{item?.course_name}</span>
                                    {
                                        item?.degree && (
                                            <span className="whitespace-nowrap space-x-1">
                                                <span>•</span>
                                                <span>DARAJA: {item?.degree}</span>
                                            </span>
                                        )
                                    }
                                    {item?.location && (
                                        <span className="whitespace-nowrap space-x-1">
                                            <span>•</span>
                                            <span className="capitalize">{item?.location}</span>
                                        </span>
                                    )}
                                </div>

                                {item?.description && (
                                    <p className="text-slate-300 text-xs leading-relaxed font-mono">
                                        {item?.description}
                                    </p>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className="border border-dashed border-white/10 p-6 text-center text-slate-500 text-xs font-mono">
                            TA&apos;LIM MA&apos;LUMOTLARI YO&apos;Q
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}