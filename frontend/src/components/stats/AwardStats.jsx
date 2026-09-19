import api from "@/api/axios"
import { useEffect, useState } from "react"
import { Award, Trophy, Calendar, ChevronLeft, ChevronRight, Sparkles, Image as ImageIcon } from "lucide-react"
import ImageViewer from "../ImageViewer"

export default function AwardStats({ username, formatDate, awards: initialAwards }) {
    const [fetchedAwards, setFetchedAwards] = useState([])
    const [loading, setLoading] = useState(!initialAwards && Boolean(username))
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(4)
    const [openImage, setOpenImage] = useState(false)
    const [openingImage, setOpeningImage] = useState("")

    useEffect(() => {
        if (initialAwards || !username) return

        let isMounted = true
        async function getAwardsByUsername() {
            try {
                setLoading(true)
                const res = await api.get(`awards/${encodeURIComponent(username)}?page=${page}&limit=${limit}`)
                if (isMounted) {
                    const data = Array.isArray(res.data) ? res.data : (res.data?.data || [])
                    setFetchedAwards(data)
                }
            } catch (err) {
                if (isMounted) {
                    setFetchedAwards([])
                    console.log(err.response?.data?.message || "Yutuqlar yuklanmadi")
                }
            } finally {
                if (isMounted) {
                    setLoading(false)
                }
            }
        }

        getAwardsByUsername()

        return () => {
            isMounted = false
        }
    }, [username, initialAwards, page, limit])

    const awards = initialAwards || fetchedAwards
    const totalCount = awards.length
    const totalPages = Math.ceil(totalCount / limit) || 1
    const paginatedAwards = awards.slice((page - 1) * limit, page * limit)

    const formatAwardDate = (dateStr) => {
        if (!dateStr) return null
        if (formatDate) return formatDate(dateStr)
        try {
            const d = new Date(dateStr)
            return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        } catch {
            return dateStr
        }
    }

    return (
        <section className="w-full border-x border-b border-white/15 bg-[#0b0c14] p-5 sm:p-6 flex flex-col gap-5 font-mono">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between border-b border-white/12 pb-4 gap-3">
                <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 bg-amber-500/10 border border-amber-500/30 flex items-center justify-center rounded-sm">
                        <Trophy className="w-4 h-4 text-amber-400" />
                    </div>
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                            <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-white">
                                AWARDS & CERTIFICATES
                            </h2>
                            <span className="text-xs font-mono border border-amber-500/30 px-2 py-0.5 bg-amber-500/10 text-amber-300 font-semibold">
                                {totalCount} TA
                            </span>
                        </div>
                        <span className="text-[10px] text-slate-400 uppercase tracking-wider">
                            SERTIFIKATLAR VA MAFAQQIYATLAR RO&apos;YXATI
                        </span>
                    </div>
                </div>
            </div>

            {/* Content */}
            {loading ? (
                <div className="border border-dashed border-white/10 p-6 text-center text-slate-500 text-xs font-mono">
                    YUTUQLAR YUKLANMOQDA...
                </div>
            ) : awards.length === 0 ? (
                <div className="border border-dashed border-white/10 p-6 text-center text-slate-500 text-xs font-mono">
                    YUTUQ VA SERTIFIKATLAR YO&apos;Q
                </div>
            ) : (
                <div className="flex flex-col gap-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full">
                        {paginatedAwards.map((item) => {
                            const dateValue = item.date_achived || item.date_achieved
                            const formattedDate = formatAwardDate(dateValue)

                            return (
                                <div
                                    key={item.id}
                                    className="border border-white/12 bg-[#0e101c] hover:border-amber-500/40 p-4 sm:p-5 flex flex-col justify-between gap-4 transition-all duration-200 group relative"
                                >
                                    <div className="flex flex-col gap-3">
                                        {/* Image or Placeholder Header */}
                                        <div className="w-full h-85 overflow-hidden border border-white/10 bg-[#06070b] relative group-hover:border-amber-500/30 transition-colors flex items-center justify-center">
                                            {item.image_url ? (
                                                <>
                                                    <img
                                                        onClick={() => {
                                                            setOpeningImage(item.image_url)
                                                            setOpenImage(true)
                                                        }}
                                                        src={item.image_url}
                                                        alt={item.title || "Yutuq rasm"}
                                                        className="cursor-pointer w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                    />
                                                    <div className="absolute top-2 right-2 p-1.5 bg-black/60 backdrop-blur-sm border border-white/20 text-amber-300 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                                        <ImageIcon className="w-3.5 h-3.5" />
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="w-full h-full flex flex-col items-center justify-center bg-[#0d0e17] text-amber-400/80 p-4 gap-2">
                                                    <div className="w-12 h-12 rounded-full border border-amber-500/30 bg-amber-500/10 flex items-center justify-center">
                                                        <Award className="w-6 h-6 text-amber-400" />
                                                    </div>
                                                    <span className="text-[10px] font-mono text-center text-amber-300/70 tracking-widest uppercase">
                                                        SERTIFIKAT RASMI <br /> YUKLANMAGAN
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Title & Date */}
                                        <div className="flex flex-col gap-1.5">
                                            <div className="flex items-start justify-between gap-2">
                                                <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider group-hover:text-amber-300 transition-colors line-clamp-2">
                                                    {item.title}
                                                </h3>
                                            </div>

                                            {formattedDate && (
                                                <div className="flex items-center gap-1.5 text-[11px] text-amber-400 font-mono">
                                                    <Calendar className="w-3 h-3 text-amber-400/80 shrink-0" />
                                                    <span>{formattedDate}</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Description */}
                                        {item.description && (
                                            <p className="text-slate-300 text-xs leading-relaxed font-mono line-clamp-3 border-t border-white/5 pt-2">
                                                {item.description}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                            <div className="flex items-center gap-1.5">
                                <button
                                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                                    disabled={page <= 1}
                                    className={`flex items-center gap-1 px-3 py-1 border text-xs font-mono uppercase tracking-wider transition-colors ${page <= 1
                                        ? "opacity-40 cursor-not-allowed border-white/10 text-slate-500 bg-white/5"
                                        : "border-white/15 bg-white/5 hover:bg-amber-500/20 hover:border-amber-500/40 text-slate-200 hover:text-white cursor-pointer"
                                        }`}
                                >
                                    <ChevronLeft className="w-3.5 h-3.5 -translate-y-px" />
                                    <span className="translate-y-px">OLDINGI</span>
                                </button>

                                <div className="flex items-center gap-1">
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                                        <button
                                            key={p}
                                            onClick={() => setPage(p)}
                                            className={`w-7 h-7 text-xs font-mono flex items-center justify-center border transition-colors cursor-pointer ${page === p
                                                ? "border-amber-500/60 bg-amber-500/20 text-amber-300 font-bold"
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
                                        : "border-white/15 bg-white/5 hover:bg-amber-500/20 hover:border-amber-500/40 text-slate-200 hover:text-white cursor-pointer"
                                        }`}
                                >
                                    <span className="translate-y-px">KEYINGI</span>
                                    <ChevronRight className="w-3.5 h-3.5 -translate-y-px" />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Image Viewer Modal */}
                    {openImage && (
                        <ImageViewer
                            onCancel={() => setOpenImage(false)}
                            src={openingImage}
                        />
                    )}
                </div>
            )}
        </section>
    )
}