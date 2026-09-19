import api from "@/api/axios"
import { useEffect, useState } from "react"
import { FolderKanban, ExternalLink, Globe, GitBranch, ChevronLeft, ChevronRight, Quote } from "lucide-react"
import Link from "next/link"
import ImageViewer from "../ImageViewer"

export default function PortfolioStats({ username, formatDate }) {
    const [portfolio, setPortfolio] = useState([])
    const [loading, setLoading] = useState(Boolean(username))
    const [page, setPage] = useState(1)
    const [limit] = useState(3)
    const [totalPages, setTotalPages] = useState(1)
    const [totalCount, setTotalCount] = useState(0)
    const [openImage, setOpenImage] = useState(false)
    const [openingImage, setOpeningImage] = useState("")

    useEffect(() => {
        if (!username) return

        let isMounted = true
        async function getByUsername() {
            try {
                setLoading(true)
                const response = await api.get(`portfolio/${username}?page=${page}&limit=${limit}`)
                if (isMounted) {
                    const resData = response.data
                    if (resData && Array.isArray(resData.data)) {
                        setPortfolio(resData.data)
                        setTotalPages(resData.totalPages || 1)
                        setTotalCount(resData.total || resData.data.length)
                    } else if (Array.isArray(resData)) {
                        setPortfolio(resData)
                        setTotalCount(resData.length)
                        setTotalPages(Math.ceil(resData.length / limit) || 1)
                    } else {
                        setPortfolio([])
                        setTotalCount(0)
                        setTotalPages(1)
                    }
                }
            } catch (err) {
                if (isMounted) {
                    setPortfolio([])
                    setTotalCount(0)
                    setTotalPages(1)
                    console.log(err.response?.data?.message || "Portfolio topilmadi!")
                }
            } finally {
                if (isMounted) {
                    setLoading(false)
                }
            }
        }

        getByUsername()

        return () => {
            isMounted = false
        }
    }, [username, page, limit])

    const formatUrl = (url) => {
        if (!url) return "#"
        if (url.startsWith("http://") || url.startsWith("https://")) return url
        return `https://${url}`
    }

    return (
        <section className="w-full border-x border-b border-white/15 bg-[#0b0c14] p-5 sm:p-6 flex flex-col gap-5 font-mono">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between border-b border-white/12 pb-4 gap-3">
                <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center rounded-sm">
                        <FolderKanban className="w-4 h-4 text-indigo-400" />
                    </div>
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                            <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-white">
                                PORTFOLIO // LOYIHALAR
                            </h2>
                            <span className="text-xs text-nowrap font-mono border border-indigo-500/30 px-2 py-0.5 bg-indigo-500/10 text-indigo-300 font-semibold">
                                {totalCount} TA
                            </span>
                        </div>
                        <span className="text-[10px] text-slate-400 uppercase tracking-wider">
                            AMALIY LOYIHALAR VA TAQDIMOTLAR
                        </span>
                    </div>
                </div>
            </div>

            {/* Content */}
            {loading ? (
                <div className="border border-dashed border-white/10 p-6 text-center text-slate-500 text-xs font-mono">
                    PORTFOLIO YUKLANMOQDA...
                </div>
            ) : portfolio.length === 0 ? (
                <div className="border border-dashed border-white/10 p-6 text-center text-slate-500 text-xs font-mono">
                    PORTFOLIO LOYIHALARI YO&apos;Q
                </div>
            ) : (
                <div className="flex flex-col gap-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
                        {portfolio.map((item) => {
                            const techList = Array.isArray(item.technologies)
                                ? item.technologies
                                : typeof item.technologies === "string"
                                    ? item.technologies.split(",").map((t) => t.trim()).filter(Boolean)
                                    : []

                            return (
                                <div
                                    key={item.id}
                                    className="border border-white/12 bg-[#0e101c] hover:border-indigo-500/40 p-4 sm:p-5 flex flex-col justify-between gap-4 transition-all duration-200 group relative"
                                >
                                    <div className="flex flex-col gap-3">
                                        <div className="w-full h-48 sm:h-56 lg:h-60 overflow-hidden border border-white/10 bg-[#06070b] relative group-hover:border-indigo-500/30 transition-colors">
                                            {item.cover_image ? (
                                                <img
                                                    onClick={() => { setOpenImage(true); setOpeningImage(item.cover_image) }}
                                                    src={item.cover_image}
                                                    alt={item.title || "Portfolio loyihasi"}
                                                    className="cursor-pointer w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-indigo-950/60 text-indigo-300 font-mono font-bold text-2xl uppercase">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className="w-10 h-10 text-indigo-500/60"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="1.2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    >
                                                        <rect x="3" y="3" width="7" height="7" />
                                                        <rect x="14" y="3" width="7" height="7" />
                                                        <rect x="14" y="14" width="7" height="7" />
                                                        <rect x="3" y="14" width="7" height="7" />
                                                    </svg>
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex items-center justify-between gap-2">
                                            <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider group-hover:text-indigo-300 transition-colors line-clamp-1">
                                                {item.title}
                                            </h3>
                                            {item.created_at && (
                                                <span className="text-[10px] text-slate-500 whitespace-nowrap shrink-0">
                                                    Joylandi - {formatDate ? formatDate(item.created_at) : new Date(item.created_at).toLocaleDateString()}
                                                </span>
                                            )}
                                        </div>

                                        {item.description && (
                                            <p className="text-slate-300 text-xs leading-relaxed font-mono line-clamp-3">
                                                {item.description}
                                            </p>
                                        )}

                                        {item.hint && (
                                            <div className="flex items-start gap-2 p-2 bg-yellow-500/10 border border-yellow-500/30 text-yellow-300 text-xs font-mono rounded-sm w-full">
                                                <Quote className="w-3.75 h-3.75 text-yellow-400 shrink-0 mt-0.5" />
                                                <span className="text-yellow-200/90 translate-y-0.5">{item.hint}</span>
                                            </div>
                                        )}

                                        {/* Tech badges */}
                                        {techList.length > 0 && (
                                            <div className="flex flex-wrap gap-1.5 pt-1">
                                                {techList.map((tech, idx) => (
                                                    <span
                                                        key={idx}
                                                        className="text-[10px] font-mono text-indigo-300 border border-indigo-500/30 px-2 py-0.5 bg-indigo-500/10 uppercase"
                                                    >
                                                        {tech}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Action Buttons */}
                                    {(item.demo_url || item.github_url) && (
                                        <div className="flex items-center gap-2 pt-3 border-t border-white/10 mt-auto">
                                            {item.demo_url && (
                                                <Link
                                                    href={formatUrl(item.demo_url)}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-mono uppercase tracking-wider transition-colors"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-indigo-300 shrink-0 -translate-y-0.25" fill="currentColor" viewBox="0 0 16 16">
                                                        <path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m7.5-6.923c-.67.204-1.335.82-1.887 1.855q-.215.403-.395.872c.705.157 1.472.257 2.282.287zM4.249 3.539q.214-.577.481-1.078a7 7 0 0 1 .597-.933A7 7 0 0 0 3.051 3.05q.544.277 1.198.49zM3.509 7.5c.036-1.07.188-2.087.436-3.008a9 9 0 0 1-1.565-.667A6.96 6.96 0 0 0 1.018 7.5zm1.4-2.741a12.3 12.3 0 0 0-.4 2.741H7.5V5.091c-.91-.03-1.783-.145-2.591-.332M8.5 5.09V7.5h2.99a12.3 12.3 0 0 0-.399-2.741c-.808.187-1.681.301-2.591.332zM4.51 8.5c.035.987.176 1.914.399 2.741A13.6 13.6 0 0 1 7.5 10.91V8.5zm3.99 0v2.409c.91.03 1.783.145 2.591.332.223-.827.364-1.754.4-2.741zm-3.282 3.696q.18.469.395.872c.552 1.035 1.218 1.65 1.887 1.855V11.91c-.81.03-1.577.13-2.282.287zm.11 2.276a7 7 0 0 1-.598-.933 9 9 0 0 1-.481-1.079 8.4 8.4 0 0 0-1.198.49 7 7 0 0 0 2.276 1.522zm-1.383-2.964A13.4 13.4 0 0 1 3.508 8.5h-2.49a6.96 6.96 0 0 0 1.362 3.675c.47-.258.995-.482 1.565-.667m6.728 2.964a7 7 0 0 0 2.275-1.521 8.4 8.4 0 0 0-1.197-.49 9 9 0 0 1-.481 1.078 7 7 0 0 1-.597.933M8.5 11.909v3.014c.67-.204 1.335-.82 1.887-1.855q.216-.403.395-.872A12.6 12.6 0 0 0 8.5 11.91zm3.555-.401c.57.185 1.095.409 1.565.667A6.96 6.96 0 0 0 14.982 8.5h-2.49a13.4 13.4 0 0 1-.437 3.008M14.982 7.5a6.96 6.96 0 0 0-1.362-3.675c-.47.258-.995.482-1.565.667.248.92.4 1.938.437 3.008zM11.27 2.461q.266.502.482 1.078a8.4 8.4 0 0 0 1.196-.49 7 7 0 0 0-2.275-1.52c.218.283.418.597.597.932m-.488 1.343a8 8 0 0 0-.395-.872C9.835 1.897 9.17 1.282 8.5 1.077V4.09c.81-.03 1.577-.13 2.282-.287z" />
                                                    </svg>
                                                    <span className="translate-y-0.25">DEMO</span>
                                                    <ExternalLink className="w-3 h-3 text-indigo-400/70 -translate-y-0.25" />
                                                </Link>
                                            )}

                                            {item.github_url && (
                                                <Link
                                                    href={formatUrl(item.github_url)}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 text-slate-200 border border-white/15 text-xs font-mono uppercase tracking-wider transition-colors"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-indigo-300 shrink-0 -translate-y-0.25" fill="currentColor" viewBox="0 0 16 16">
                                                        <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8" />
                                                    </svg>
                                                    <span className="translate-y-0.25 text-indigo-300">CODE</span>
                                                    <ExternalLink className="w-3 h-3 text-indigo-300 -translate-y-0.25" />
                                                </Link>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                    </div>

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div className="flex flex-wrap items-center justify-center gap-3">
                            <div className="flex items-center gap-1.5">
                                <button
                                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                                    disabled={page <= 1}
                                    className={`flex items-center gap-1 px-3 py-1 border text-xs font-mono uppercase tracking-wider transition-colors ${page <= 1
                                        ? "opacity-40 cursor-not-allowed border-white/10 text-slate-500 bg-white/5"
                                        : "border-white/15 bg-white/5 hover:bg-indigo-500/20 hover:border-indigo-500/40 text-slate-200 hover:text-white cursor-pointer"
                                        }`}
                                >
                                    <ChevronLeft className="w-3.5 h-3.5 -translate-y-0.25" />
                                    <span className="translate-y-0.25">Oldingi</span>
                                </button>

                                <div className="flex items-center gap-1">
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                                        <button
                                            key={p}
                                            onClick={() => setPage(p)}
                                            className={`w-7 h-7 text-xs font-mono flex items-center justify-center border transition-colors cursor-pointer ${page === p
                                                ? "border-indigo-500/60 bg-indigo-500/20 text-indigo-300 font-bold"
                                                : "border-white/10 bg-white/5 text-slate-400 hover:text-white hover:border-white/20"
                                                }`}
                                        >
                                            {p}
                                        </button>
                                    ))}
                                </div>

                                <button
                                    onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                                    disabled={page >= totalPages}
                                    className={`flex items-center gap-1 px-3 py-1 border text-xs font-mono uppercase tracking-wider transition-colors ${page >= totalPages
                                        ? "opacity-40 cursor-not-allowed border-white/10 text-slate-500 bg-white/5"
                                        : "border-white/15 bg-white/5 hover:bg-indigo-500/20 hover:border-indigo-500/40 text-slate-200 hover:text-white cursor-pointer"
                                        }`}
                                >
                                    <span className="translate-y-0.25">KEYINGI</span>
                                    <ChevronRight className="w-3.5 h-3.5 -translate-y-0.25" />
                                </button>
                            </div>
                        </div>
                    )}


                    {
                        openImage && (
                            <ImageViewer
                                onCancel={() => setOpenImage(false)}
                                src={openingImage}
                            />
                        )
                    }
                </div>
            )}
        </section>
    )
}