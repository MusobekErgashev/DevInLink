'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
    Quote,
    Send,
    Heart,
    Share2,
    Copy,
    Trash2,
    Search,
    Sparkles,
    MessageSquare,
    User,
    Briefcase,
    Check,
    RefreshCw,
    Clock,
    Edit2,
} from 'lucide-react'
import api from '@/api/axios'
import toast from 'react-hot-toast'
import WarningModal from '../WarningModal'

export default function Quotes() {
    const [quotesList, setQuotesList] = useState([])
    const [defaultUser, setDefaultUser] = useState(null)
    const [currentUser, setCurrentUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [newQuote, setNewQuote] = useState("")
    const [author, setAuthor] = useState("")
    const [searchQuery, setSearchQuery] = useState('')
    const [copiedId, setCopiedId] = useState(null)
    const [likedIds, setLikedIds] = useState({})
    const [likeCounts, setLikeCounts] = useState({})
    const [deletingId, setDeletingId] = useState(null)
    const [editingId, setEditingId] = useState(null)
    const [openWarningModal, setOpenWarningModal] = useState(false)

    // Fetch current logged in user profile
    useEffect(() => {
        async function fetchCurrentUser() {
            try {
                const res = await api.get('users/me')
                if (res.status === 200) {
                    const uData = Array.isArray(res.data) ? res.data[0] : res.data
                    setCurrentUser(uData)
                }
            } catch (err) {
                // User may be a guest or unauthorized, silent catch
                setCurrentUser(null)
            }
        }
        fetchCurrentUser()
    }, [])

    // Fetch quotes from API
    const fetchQuotes = async () => {
        setLoading(true)
        try {
            const res = await api.get('quotes')
            if (res.data) {
                let quotesData = []
                let fallbackUser = null

                if (Array.isArray(res.data)) {
                    quotesData = res.data
                } else if (res.data.quote && Array.isArray(res.data.quote)) {
                    quotesData = res.data.quote
                    fallbackUser = res.data.user || null
                }

                setQuotesList(quotesData)
                setDefaultUser(fallbackUser)

                const initialLikes = {}
                const initialLikedIds = {}
                quotesData.forEach(q => {
                    initialLikes[q.id] = q.likes !== undefined && q.likes !== null ? parseInt(q.likes, 10) : 0
                    if (q.isLiked) {
                        initialLikedIds[q.id] = true
                    }
                })
                setLikeCounts(initialLikes)
                setLikedIds(initialLikedIds)
            }
        } catch (err) {
            console.error('Fetch quotes error:', err)
            toast.error(err.response?.data?.message || 'Iqtiboslarni yuklashda xatolik yuz berdi')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        let ignore = false
        async function loadData() {
            try {
                const res = await api.get('quotes')
                if (!ignore && res.data) {
                    let quotesData = []
                    let fallbackUser = null

                    if (Array.isArray(res.data)) {
                        quotesData = res.data
                    } else if (res.data.quote && Array.isArray(res.data.quote)) {
                        quotesData = res.data.quote
                        fallbackUser = res.data.user || null
                    }

                    setQuotesList(quotesData)
                    setDefaultUser(fallbackUser)

                    const initialLikes = {}
                    const initialLikedIds = {}
                    quotesData.forEach(q => {
                        initialLikes[q.id] = q.likes !== undefined && q.likes !== null ? parseInt(q.likes, 10) : 0
                        if (q.isLiked) {
                            initialLikedIds[q.id] = true
                        }
                    })
                    setLikeCounts(initialLikes)
                    setLikedIds(initialLikedIds)
                }
            } catch (err) {
                console.error('Fetch quotes error:', err)
            } finally {
                if (!ignore) setLoading(false)
            }
        }
        loadData()
        return () => {
            ignore = true
        }
    }, [])

    // Submit new or updated quote
    const handleCreateQuote = async (e) => {
        e.preventDefault()
        if (!newQuote.trim()) {
            toast.error('Iqtibos matnini kiriting!')
            return
        }

        try {
            setSubmitting(true)
            if (editingId) {
                // Update existing quote
                const res = await api.put(`quotes/${editingId}`, { quote: newQuote.trim(), author: author.trim() })
                if (res.status === 200 || res.status === 201) {
                    toast.success('Iqtibos muvaffaqiyatli o\'zgartirildi!')
                    setNewQuote("")
                    setAuthor("")
                    setEditingId(null)
                    fetchQuotes()
                }
            } else {
                // Create new quote
                const res = await api.post('quotes', { quote: newQuote.trim(), author: author.trim() })
                if (res.status === 200 || res.status === 201) {
                    toast.success('Iqtibos muvaffaqiyatli joylandi! ✨')
                    setNewQuote("")
                    setAuthor("")
                    fetchQuotes()
                }
            }
        } catch (err) {
            console.error('Quote submit error:', err)
            toast.error(err.response?.data?.message || (editingId ? 'Iqtibosni o\'zgartirishda xatolik' : 'Iqtibos joylashda xatolik yuz berdi'))
        } finally {
            setSubmitting(false)
        }
    }

    // Delete quote
    const handleDeleteQuote = async (id) => {
        try {
            setDeletingId(id)
            const res = await api.delete(`quotes/${id}`)
            if (res.status === 200) {
                toast.success('Iqtibos o\'chirildi')
                setQuotesList(prev => prev.filter(q => q.id !== id))
                setDeletingId(null)
                setOpenWarningModal(false)
            }
        } catch (err) {
            console.error('Delete quote error:', err)
            toast.error(err.response?.data?.message || 'Iqtibosni o\'chirishda xatolik')
            setDeletingId(null)
            setOpenWarningModal(false)
        } finally {
            setDeletingId(null)
        }
    }

    // Handle Like Toggle
    const toggleLike = async (id) => {
        const currentlyLiked = !!likedIds[id]
        const currentCount = likeCounts[id] || 0
        const newLiked = !currentlyLiked
        const newCount = Math.max(0, currentCount + (newLiked ? 1 : -1))

        setLikedIds(prev => ({ ...prev, [id]: newLiked }))
        setLikeCounts(prev => ({ ...prev, [id]: newCount }))

        try {
            const res = await api.post(`quotes/like/${id}`)
            if (res.data) {
                setLikedIds(prev => ({ ...prev, [id]: res.data.liked }))
                setLikeCounts(prev => ({ ...prev, [id]: res.data.likesCount ?? res.data.likes ?? newCount }))
            }
        } catch (err) {
            setLikedIds(prev => ({ ...prev, [id]: currentlyLiked }))
            setLikeCounts(prev => ({ ...prev, [id]: currentCount }))
            toast.error(err.response?.data?.message || 'Layk bosish uchun tizimga kiring!')
        }
    }

    // Handle Copy Quote
    const handleCopyQuote = (text, id) => {
        if (typeof window !== 'undefined') {
            navigator.clipboard?.writeText(text)
            setCopiedId(id)
            toast.success('Iqtibos nusxalandi!')
            setTimeout(() => setCopiedId(null), 2000)
        }
    }

    // Handle Share Quote
    const handleShareQuote = (quoteObj) => {
        if (typeof window !== 'undefined') {
            const shareUrl = window.location.href
            navigator.clipboard?.writeText(`"${quoteObj.quote}" - DevInLink: ${shareUrl}`)
            toast.success('Havola nusxalandi!')
        }
    }

    // Date Formatter
    const formatDate = (dateStr) => {
        if (!dateStr) return 'Hozirgina'
        try {
            const d = new Date(dateStr)
            if (isNaN(d.getTime())) return dateStr

            const now = new Date()
            const diffMinutes = Math.floor((now - d) / (1000 * 60))

            if (diffMinutes < 1) return 'Hozirgina'
            if (diffMinutes < 60) return `${diffMinutes} daq oldin`

            const diffHours = Math.floor(diffMinutes / 60)
            if (diffHours < 24) return `${diffHours} soat oldin`

            return d.toLocaleDateString('uz-UZ', { month: 'short', day: 'numeric', year: 'numeric' })
        } catch {
            return dateStr
        }
    }

    // Set edit mode: fill form with existing quote data
    const editQuote = (quote, author, id) => {
        setNewQuote(quote)
        setAuthor(author || '')
        setEditingId(id)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    // Determine current active post author info
    const activeAvatar = currentUser?.avatar || defaultUser?.avatar
    const activeUsername = currentUser?.username || defaultUser?.username || 'dasturchi'
    const activeJob = currentUser?.job_title || defaultUser?.jobTitle || 'Developer'

    return (
        <div className="w-full text-slate-100 font-inter min-h-screen pb-16">
            <div className="max-w-4xl mx-auto flex flex-col gap-6">
                <div className="border border-white/12 bg-[#0b0c14] p-2 sm:p-6 shadow-xl relative group">
                    <div className="flex items-start gap-2 sm:gap-4">
                        {/* Avatar */}
                        <div className="hidden relative w-11 h-11 border-2 border-indigo-500/50 bg-[#06070b] shrink-0 sm:flex items-center justify-center overflow-hidden">
                            {activeAvatar ? (
                                <img src={activeAvatar} alt="User Avatar" className="object-cover w-full h-full" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-indigo-950/60 text-indigo-300 font-mono font-bold text-lg uppercase">
                                    {activeUsername.charAt(0)}
                                </div>
                            )}
                            <div className="absolute -top-0.5 -left-0.5 w-1.5 h-1.5 bg-indigo-400" />
                            <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-indigo-400" />
                            <div className="absolute -bottom-0.5 -left-0.5 w-1.5 h-1.5 bg-indigo-400" />
                            <div className="absolute -bottom-0.5 -right-0.5 w-1.5 h-1.5 bg-indigo-400" />
                        </div>

                        {/* Input Form */}
                        <form onSubmit={handleCreateQuote} className="flex-1 flex flex-col gap-1">
                            <div className="relative">
                                <textarea
                                    value={newQuote}
                                    onChange={(e) => setNewQuote(e.target.value)}
                                    maxLength={300}
                                    rows={3}
                                    placeholder="Hayotiy shioringiz yoki hikmatli iqtibosingizni ulashing..."
                                    className="w-full bg-[#07080e] border border-white/15 focus:border-indigo-500 p-3 sm:p-4 text-sm text-slate-100 placeholder-slate-500 font-sans outline-none resize-none transition-all"
                                />
                                <span className={`absolute bottom-3 right-3 text-[11px] font-mono ${newQuote.length > 270 ? 'text-amber-400' : 'text-slate-500'}`}>
                                    {newQuote.length}/300
                                </span>
                            </div>

                            {/* Submit Action Bar */}
                            <div className="flex items-center gap-2 justify-between">
                                <input
                                    type="text"
                                    placeholder='Muallif'
                                    value={author}
                                    onChange={(e) => setAuthor(e.target.value)}
                                    maxLength={25}
                                    className="max-w-full sm:max-w-90 bg-[#07080e] border border-white/15 focus:border-indigo-500 px-3 sm:px-4 py-2 text-sm text-slate-100 placeholder-slate-500 font-sans outline-none transition-all"
                                />

                                <div className="flex items-center gap-2">
                                    {editingId && (
                                        <button
                                            type="button"
                                            onClick={() => { setEditingId(null); setNewQuote(''); setAuthor('') }}
                                            className="flex items-center gap-2 px-4 py-2 bg-transparent hover:bg-white/5 text-slate-400 hover:text-slate-200 font-mono text-xs font-bold uppercase tracking-wider border border-white/15 hover:border-white/30 transition-all cursor-pointer"
                                        >
                                            Bekor
                                        </button>
                                    )}
                                    <button
                                        type="submit"
                                        disabled={submitting || !newQuote.trim()}
                                        className={`flex items-center gap-2 px-5 py-2 disabled:opacity-50 disabled:cursor-not-allowed text-white font-mono text-xs font-bold uppercase tracking-wider border transition-all cursor-pointer shadow-lg ${
                                            editingId
                                                ? 'bg-green-600 hover:bg-green-500 border-green-400 shadow-green-600/20'
                                                : 'bg-indigo-600 hover:bg-indigo-500 border-indigo-400 shadow-indigo-600/20'
                                        }`}
                                    >
                                        {submitting ? (
                                            <>
                                                <RefreshCw size={14} className="animate-spin" />
                                                <span>{editingId ? 'Saqlanmoqda...' : 'Joylanmoqda...'}</span>
                                            </>
                                        ) : (
                                            <>
                                                {editingId ? <Edit2 size={14} /> : <Send size={14} />}
                                                <span className="hidden sm:block">{editingId ? 'SAQLASH' : 'ULASHISH'}</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="relative w-full">
                    <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Iqtiboslar yoki mualliflar bo'yicha qidirish..."
                        className="w-full bg-[#0e101c] border border-white/12 focus:border-indigo-500/60 pl-10 pr-4 py-2.5 text-xs font-mono text-slate-200 placeholder-slate-500 outline-none transition-colors"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery('')}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 text-xs font-mono uppercase"
                        >
                            Tozalash
                        </button>
                    )}
                </div>

                {/* Quotes Feed */}
                <div className="flex flex-col gap-4">
                    {loading ? (
                        // Skeleton Loaders
                        Array.from({ length: 3 }).map((_, idx) => (
                            <div key={idx} className="border border-white/10 bg-[#0e101c] p-6 flex flex-col gap-4 animate-pulse">
                                <div className="flex items-center gap-3">
                                    <div className="w-11 h-11 bg-white/10" />
                                    <div className="flex flex-col gap-2">
                                        <div className="w-32 h-3.5 bg-white/10" />
                                        <div className="w-24 h-2.5 bg-white/5" />
                                    </div>
                                </div>
                                <div className="w-full h-12 bg-white/5" />
                                <div className="w-48 h-4 bg-white/10" />
                            </div>
                        ))
                    ) : quotesList.length === 0 ? (
                        // Empty state
                        <div className="border border-white/10 bg-[#0e101c] p-12 text-center flex flex-col items-center justify-center gap-3">
                            <MessageSquare size={40} className="text-slate-600 mb-1" />
                            <h3 className="text-base font-mono font-bold uppercase text-slate-300">
                                Hozircha iqtiboslar topilmadi
                            </h3>
                            <p className="text-xs font-mono text-slate-500 max-w-sm">
                                {searchQuery ? "Qidiruv bo'yicha hech narsa topilmadi" : "Birinchi bo'lib o'zingizning hikmatli shioringizni ulashing!"}
                            </p>
                        </div>
                    ) : (
                        // Render Quotes
                        quotesList.map((item) => {
                            // Extract author info from item or defaultUser
                            const authorUsername = item.username || defaultUser?.username || 'prodev_uz'
                            const authorAvatar = item.avatar || defaultUser?.avatar
                            const authorJob = item.jobTitle || item.job_title || defaultUser?.jobTitle || 'Fullstack development'
                            const isLiked = likedIds[item.id]
                            const currentLikes = likeCounts[item.id] || 0
                            const isOwner = currentUser && (currentUser.id === item.user_id || currentUser.username === authorUsername)

                            return (
                                <div
                                    key={item.id}
                                    className="border border-white/12 bg-[#0e101c] hover:border-indigo-500/40 p-2 sm:p-6 transition-all duration-300 shadow-xl relative group"
                                >
                                    {/* Left Cyber Accent Line on Hover */}
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />

                                    <div className="flex flex-col gap-4">
                                        {/* Top Row: User Avatar & Info */}
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex items-center gap-3">
                                                <Link href={`/${authorUsername}`} className="relative w-11 h-11 border border-indigo-500/50 bg-[#06070b] shrink-0 flex items-center justify-center overflow-hidden group-hover:border-indigo-400 transition-colors">
                                                    {authorAvatar ? (
                                                        <img src={authorAvatar} alt={authorUsername} className="object-cover w-full h-full" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center bg-indigo-950/60 text-indigo-300 font-mono font-bold text-lg uppercase">
                                                            {authorUsername.charAt(0)}
                                                        </div>
                                                    )}
                                                    <div className="absolute -top-0.5 -left-0.5 w-1 h-1 bg-indigo-400" />
                                                    <div className="absolute -top-0.5 -right-0.5 w-1 h-1 bg-indigo-400" />
                                                    <div className="absolute -bottom-0.5 -left-0.5 w-1 h-1 bg-indigo-400" />
                                                    <div className="absolute -bottom-0.5 -right-0.5 w-1 h-1 bg-indigo-400" />
                                                </Link>

                                                <div className="flex flex-col gap-0.5">
                                                    <div className="flex items-baseline gap-2">
                                                        <Link href={`/${authorUsername}`} className="text-xs sm:text-sm font-mono font-bold text-white tracking-tight hover:text-indigo-400 transition-colors">
                                                            @{authorUsername}
                                                        </Link>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                                                        {authorJob && (
                                                            <span className="flex items-center gap-1 text-[11px] text-indigo-300 bg-indigo-500/10 border border-indigo-500/25 px-1.5 py-0.2">
                                                                <Briefcase size={10} className='shrink-0' /> {authorJob}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Right: Timestamp & Actions */}
                                            <div className="flex items-center flex-wrap justify-end sm:gap-2">
                                                <span className="flex items-center gap-1 text-nowrap text-[11px] font-mono text-slate-400">
                                                    <Clock size={12} /> {formatDate(item.created_at)}
                                                </span>
                                                <div className="w-max flex">
                                                    {isOwner && (
                                                        <button
                                                            onClick={() => editQuote(item.quote, item.author, item.id)}
                                                            className="p-1.5 text-slate-500 hover:text-green-400 hover:bg-green-500/10 border border-transparent hover:border-green-500/30 transition-all cursor-pointer ml-1"
                                                            title="O'zgartirish"
                                                        >
                                                            <Edit2 size={14} />
                                                        </button>
                                                    )}

                                                    {isOwner && (
                                                        <button
                                                            onClick={() => { setOpenWarningModal(true); setDeletingId(item.id) }}
                                                            className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/30 transition-all cursor-pointer ml-1"
                                                            title="O'chirish"
                                                        >
                                                            <Trash2 size={14} />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Middle: Quote Body */}
                                        <div className="relative pl-4 sm:pl-6 sm:my-1">
                                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500/40 rounded-full" />
                                            <Quote size={20} className="text-indigo-400/40 mb-1" />
                                            <p className="text-sm sm:text-base text-slate-100 font-sans leading-relaxed tracking-wide selection:bg-indigo-500/30 whitespace-pre-wrap">
                                                {item.quote}
                                            </p>

                                            <span className="mt-1 sm:mt-2 text-xs capitalize font-mono text-slate-400">{item?.author && `- ${item.author}`}</span>
                                        </div>

                                        {/* Bottom Twitter-style Actions Bar */}
                                        <div className="flex items-center justify-between pt-3 border-t border-white/10 text-xs font-mono">
                                            <div className="flex items-center justify-between w-full gap-4">
                                                {/* Like Button */}
                                                <button
                                                    onClick={() => toggleLike(item.id)}
                                                    className={`flex items-center gap-1.5 px-2.5 py-1 border transition-all cursor-pointer ${isLiked
                                                        ? 'bg-rose-500/10 border-rose-500/40 text-rose-400 font-bold'
                                                        : 'bg-white/5 border-white/10 text-slate-400 hover:text-rose-300 hover:bg-rose-500/5'
                                                        }`}
                                                >
                                                    <Heart size={14} className={isLiked ? 'fill-rose-500 text-rose-500 -translate-y-0.25' : ''} />
                                                    <span className='translate-y-0.25'>{currentLikes}</span>
                                                </button>

                                                {/* Copy Button */}
                                                <button
                                                    onClick={() => handleCopyQuote(item.quote, item.id)}
                                                    className="flex items-center gap-1.5 px-2.5 py-1 bg-white/5 border border-white/10 text-slate-400 hover:text-slate-200 hover:bg-white/10 transition-colors cursor-pointer"
                                                    title="Nusxalash"
                                                >
                                                    {copiedId === item.id ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                                                    <span>{copiedId === item.id ? 'Nusxalandi' : 'Nusxalash'}</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    )}
                </div>

            </div>

            {
                openWarningModal && (
                    <WarningModal
                        title="Iqtibosni o'chirish"
                        message="Haqiqatdan ham bu iqtibosni o'chirmoqchimisiz?"
                        onConfirm={() => handleDeleteQuote(deletingId)}
                        onCancel={() => setOpenWarningModal(false)}
                    />
                )
            }
        </div>
    )
}