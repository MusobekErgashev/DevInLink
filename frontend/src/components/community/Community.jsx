'use client'

import api from '@/api/axios'
import { Briefcase, Check, Clock, Copy, Edit, Edit2, MessageSquare, Reply, Send, Trash, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import WarningModal from '../WarningModal'
import useUserStore from '@/utils/user.store'

const Community = () => {
    const router = useRouter()
    const [messages, setMessages] = useState([])
    const [loading, setLoading] = useState(true)
    const [copiedId, setCopiedId] = useState(null)
    const [newMessage, setNewMessage] = useState('')
    const { user: currentUser, fetchUser: fetchCurrentUser } = useUserStore()
    const myAva = currentUser ? { avatar: currentUser.avatar, first_name: currentUser.first_name, id: currentUser.id } : {}
    const [replyingMessage, setReplyingMessage] = useState({})
    const [editingId, setEditingId] = useState(null)
    const [deletingId, setDeletingId] = useState(null)
    const inputRef = useRef(null)

    const [openWarnModal, setOpenWarnModal] = useState(false)

    useEffect(() => {
        async function getMessages() {
            try {
                setLoading(true)
                const res = await api.get('community')
                setMessages(res.data)
            } catch (error) {
                console.log(error)
            } finally {
                setLoading(false)
            }
        }

        getMessages()
        fetchCurrentUser()
    }, [fetchCurrentUser])

    const handleCopy = (text, id) => {
        if (typeof window !== 'undefined' && text) {
            navigator.clipboard?.writeText(text)
            setCopiedId(id)
            toast.success('Xabar nusxalandi!')
            setTimeout(() => setCopiedId(null), 2000)
        }
    }

    const handleReply = (item) => {
        if (item?.username) {
            setEditingId(null)
            setReplyingMessage({ id: item.id, username: item.username, message: item.message })

            if (inputRef.current) {
                inputRef.current.focus()
            }
        }
    }

    const handleEdit = (item) => {
        setReplyingMessage({ id: null, username: '', message: '' })
        setEditingId(item.id)
        setNewMessage(item.message)
        if (inputRef.current) {
            inputRef.current.focus()
        }
    }

    const cancelEdit = () => {
        setEditingId(null)
        setNewMessage('')
    }

    const handleDelete = async (id) => {
        try {
            const res = await api.delete(`community/${id}`)
            if (res.status === 200 || res.status === 204) {
                setMessages((prev) => prev.filter((item) => item.id !== id))
                toast.success('Xabar o\'chirildi!')
                if (editingId === id) {
                    cancelEdit()
                }
            }
        } catch (error) {
            console.log(error)
            toast.error(error.response?.data?.message || 'Xabarni o\'chirishda xatolik!')
        }
    }

    const handlePost = async (message) => {
        try {
            if (!message || message.trim().length < 1) {
                toast.error('Xabar kiritilmadi!')
                return
            }

            if (message.trim().length > 400) {
                toast.error('Xabar 400 belgidan uzun bo\'lishi mumkin emas!')
                return
            }

            if (editingId) {
                const res = await api.put(`community/${editingId}`, { message: message.trim() })
                const updatedData = res.data
                setMessages((prev) =>
                    prev.map((item) => (item.id === editingId ? { ...item, message: updatedData.message || message.trim() } : item))
                )
                setEditingId(null)
                setNewMessage('')
                toast.success('Xabar tahrirlandi!')
            } else {
                const res = await api.post('community', {
                    message: message.trim(),
                    replying_id: replyingMessage.id || null
                })
                setMessages([...messages, res.data])
                setNewMessage('')
                setReplyingMessage({ id: null, username: '', message: '' })
                toast.success('Xabar yuborildi!')
            }
        } catch (error) {
            console.log(error)
            toast.error(error.response?.data?.message || (editingId ? 'Xabarni tahrirlashda xatolik!' : 'Xabar yuborilmadi!'))
        }
    }

    const formatDate = (dateStr) => {
        if (!dateStr) return null
        try {
            const d = new Date(dateStr)
            if (isNaN(d.getTime())) return dateStr

            const now = new Date()
            const diffMinutes = Math.floor((now - d) / (1000 * 60))

            if (diffMinutes < 1) return 'Hozirgina'
            if (diffMinutes < 60) return `${diffMinutes}m oldin`

            const diffHours = Math.floor(diffMinutes / 60)
            if (diffHours < 24) return `${diffHours}h oldin`

            return d.toLocaleDateString('uz-UZ', { month: 'short', day: 'numeric' })
        } catch {
            return dateStr
        }
    }

    return (
        <div className='p-4 sm:p-6 flex gap-4 flex-col justify-between min-h-screen max-w-6xl mx-auto font-mono text-slate-100'>
            <div className='flex flex-col gap-4'>
                {/* Header Box */}
                <div className="w-full p-3 sm:p-4 bg-[#0e101c] border border-white/12 flex items-center justify-between shadow-xl">
                    <div className="flex items-center gap-2">
                        <h1 className='text-white font-bold text-sm sm:text-xl uppercase tracking-wider font-mono'>Community Feed</h1>
                    </div>
                    {messages?.length > 0 && (
                        <span className="text-xs font-mono text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-1">
                            {messages.length} xabar
                        </span>
                    )}
                </div>

                {/* Messages Feed */}
                <div className="w-full overflow-y-auto flex flex-col gap-3.5 h-[calc(100vh-17rem)] custom-scrollbar">
                    {loading ? (
                        Array.from({ length: 4 }).map((_, idx) => (
                            <div key={idx} className="flex gap-3.5 bg-[#0e101c] border border-white/12 p-4 sm:p-5 animate-pulse">
                                <div className="w-11 h-11 border border-white/10 bg-white/10 shrink-0" />
                                <div className="flex-1 flex flex-col gap-2.5">
                                    <div className="w-36 h-4 bg-white/10" />
                                    <div className="w-full h-12 bg-white/5" />
                                    <div className="w-24 h-3 bg-white/5 self-end" />
                                </div>
                            </div>
                        ))
                    ) : messages?.length > 0 ? (
                        messages.map((item) => {
                            const displayName = [item.first_name, item.last_name].filter(Boolean).join(' ') || item.username || 'User'
                            const initial = (item.first_name?.[0] || item.username?.[0] || 'U').toUpperCase()
                            const replyTargetMsg = item.replying_message || (item.replying_id && messages.find((m) => m.id === item.replying_id)?.message)
                            const replyTargetUser = item.replying_username || (item.replying_id && messages.find((m) => m.id === item.replying_id)?.username)

                            return (
                                <div
                                    className={`flex gap-3.5 min-w-50 max-w-200 ${item.user_id === myAva.id ? "ml-auto" : ""} bg-[#0e101c] border border-white/12 hover:border-indigo-500/40 p-2 sm:p-5 transition-all duration-200 relative group shadow-lg`}
                                    key={item.id}
                                >
                                    {/* Subtle Hover Line Accent */}
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />

                                    {/* Avatar Container with Cyber Corner Marks */}
                                    <div onClick={() => router.push(`/${item.username}`)} className="relative w-11 h-11 border cursor-pointer border-indigo-500/50 bg-[#06070b] shrink-0 flex items-center justify-center overflow-hidden">
                                        {item.avatar ? (
                                            <img src={item.avatar} alt={displayName} className="h-full w-full object-cover" />
                                        ) : (
                                            <div className="h-full w-full flex items-center justify-center bg-indigo-950/60 text-indigo-300 font-mono font-bold text-base uppercase">
                                                {initial}
                                            </div>
                                        )}
                                        <div className="absolute -top-0.5 -left-0.5 w-1 h-1 bg-indigo-400" />
                                        <div className="absolute -top-0.5 -right-0.5 w-1 h-1 bg-indigo-400" />
                                        <div className="absolute -bottom-0.5 -left-0.5 w-1 h-1 bg-indigo-400" />
                                        <div className="absolute -bottom-0.5 -right-0.5 w-1 h-1 bg-indigo-400" />
                                    </div>

                                    {/* Message Main Box */}
                                    <div className="flex-1 min-w-0 flex flex-col gap-1">
                                        <div className="flex items-center justify-between flex-wrap gap-x-3 gap-y-1">
                                            <div className="flex cursor-pointer items-center flex-wrap gap-2 text-xs" onClick={() => router.push(`/${item.username}`)}>
                                                {item.user_id === myAva.id ? (
                                                    <span className="text-green-400 font-bold text-[14px]">Siz</span>
                                                ) : (
                                                    <>
                                                        <span className="font-bold text-slate-100 font-sans">{displayName}</span>

                                                        {item.username && (
                                                            <span className="text-indigo-400 font-mono text-[13px]">
                                                                @{item.username}
                                                            </span>
                                                        )}

                                                        {item.job_title && (
                                                            <span className="flex items-center gap-1 text-[11px] text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5">
                                                                <Briefcase size={10} /> {item.job_title}
                                                            </span>
                                                        )}
                                                    </>
                                                )}
                                            </div>

                                            <div className='flex items-center gap-3'>
                                                {item.created_at && (
                                                    <span className="text-[11px] font-mono text-slate-500 flex items-center gap-1">
                                                        <Clock size={11} /> {formatDate(item.created_at)}
                                                    </span>
                                                )}

                                                {item.user_id === myAva.id && (
                                                    <Edit2 size={14} className='hover:text-green-500 cursor-pointer transition-colors' onClick={() => handleEdit(item)} />
                                                )}

                                                {item.user_id === myAva.id && (
                                                    <Trash
                                                        size={14}
                                                        className='hover:text-red-500 cursor-pointer transition-colors'
                                                        onClick={() => {
                                                            setDeletingId(item.id)
                                                            setOpenWarnModal(true)
                                                        }}
                                                    />
                                                )}
                                            </div>
                                        </div>

                                        {/* Replying Preview Box if item is a reply */}
                                        {(item.replying_id || replyTargetMsg) && (
                                            <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border-l-2 border-indigo-500/80 text-xs font-mono text-slate-300 rounded-r my-1">
                                                <Reply size={13} className="text-indigo-400 shrink-0" />
                                                {replyTargetUser && (
                                                    <span className="text-indigo-400 font-bold">@{replyTargetUser}:</span>
                                                )}
                                                <span className="truncate opacity-80">{replyTargetMsg || 'Original xabar'}</span>
                                            </div>
                                        )}

                                        {/* Message Text */}
                                        <p className="text-slate-200 text-sm sm:text-base leading-relaxed font-sans selection:bg-indigo-500/30 whitespace-pre-wrap wrap-break-word">
                                            {item.message}
                                        </p>

                                        {/* Actions Footer */}
                                        <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/5 text-xs font-mono">
                                            <button
                                                onClick={() => handleCopy(item.message, item.id)}
                                                className="px-2.5 py-1 bg-white/5 border border-white/10 hover:border-indigo-500/40 hover:bg-indigo-500/10 text-slate-300 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                                                title="Xabarni nusxalash"
                                            >
                                                {copiedId === item.id ? (
                                                    <>
                                                        <Check size={13} className="text-emerald-400" />
                                                        <span className="text-emerald-400">Nusxalandi</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Copy size={13} />
                                                        <span>Nusxalash</span>
                                                    </>
                                                )}
                                            </button>

                                            <button
                                                onClick={() => handleReply(item)}
                                                className="px-2.5 py-1 text-nowrap bg-white/5 border border-white/10 hover:border-indigo-500/40 hover:bg-indigo-500/10 text-slate-300 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                                                title="Javob berish"
                                            >
                                                <Reply size={13} />
                                                <span>Javob berish</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    ) : (
                        <div className="border border-white/10 bg-[#0e101c] p-12 text-center flex flex-col items-center justify-center gap-3 my-auto">
                            <MessageSquare size={38} className="text-slate-600 mb-1" />
                            <h3 className="text-sm font-mono font-bold uppercase text-slate-300 tracking-wider">
                                Hozircha xabarlar yo&apos;q
                            </h3>
                            <p className="text-xs font-mono text-slate-500 max-w-xs">
                                Jamiyatda birinchi bo&apos;lib fikr va tajribalaringiz bilan ulashing!
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Input Bar */}
            <div className="flex flex-col border border-white/12 bg-[#0e101c] p-1 sm:p-2 gap-2 w-full sticky bottom-5 shadow-xl">
                {replyingMessage.username && (
                    <div className='border border-white/12 w-full p-2 flex gap-2 items-center bg-white/5'>
                        <span className='text-blue-500 text-[14px]'>@{replyingMessage.username}</span>
                        <p className='truncate w-full opacity-80 text-[14px]'>{replyingMessage.message}</p>

                        <button className='pl-6 cursor-pointer text-slate-400 hover:text-white' onClick={() => setReplyingMessage({ id: null, username: '', message: '' })}>
                            <X className='size-5' />
                        </button>
                    </div>
                )}

                {editingId && (
                    <div className='border border-green-500/30 bg-green-500/10 w-full p-2 flex gap-2 items-center text-xs font-mono text-green-400'>
                        <Edit2 className='size-4' />
                        <span>Xabarni tahrirlayapsiz...</span>
                        <button className='ml-auto cursor-pointer text-slate-400 hover:text-white' onClick={cancelEdit}>
                            <X className='size-4' />
                        </button>
                    </div>
                )}

                <div className='flex gap-1 sm:gap-2 w-full'>
                    <div className="relative w-10 h-10 border border-indigo-500/40 bg-[#06070b] shrink-0 flex items-center justify-center overflow-hidden">
                        {myAva.avatar ? (
                            <img src={myAva.avatar} alt="avatar" className='w-full h-full object-cover' />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-indigo-950/60 text-indigo-300 font-mono font-bold text-sm uppercase">
                                {myAva.first_name?.slice(0, 1)}
                            </div>
                        )}
                    </div>

                    <div className="flex-1 border border-white/12 bg-[#07080e] p-1.5 flex items-center focus-within:border-indigo-500/60 transition-colors">
                        <input
                            ref={inputRef}
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault()
                                    handlePost(newMessage)
                                }
                            }}
                            className="w-full text-sm font-sans focus:outline-none bg-transparent text-white placeholder-slate-500 px-2"
                            placeholder={editingId ? "Tahrirlangan xabaringizni yozing..." : "Xabaringizni yozing..."}
                        />
                    </div>
                    <button
                        onClick={() => handlePost(newMessage)}
                        className={`${
                            editingId
                                ? 'bg-emerald-600 hover:bg-emerald-500 border-emerald-400'
                                : 'bg-indigo-600 hover:bg-indigo-500 border-indigo-400'
                        } border text-white px-4 py-2 cursor-pointer transition-all flex items-center justify-center shadow-lg active:scale-95`}
                    >
                        {editingId ? <Check size={18} /> : <Send size={18} />}
                    </button>
                </div>
            </div>

            {openWarnModal && (
                <WarningModal
                    title="Xabarni o'chirish"
                    description="Haqiqatan ham ushbu xabarni o'chirmoqchimisiz?"
                    message="Bu harakatni bekor qilib bo'lmaydi!"
                    confirmText="Ha, o'chirish"
                    cancelText="Bekor qilish"
                    onConfirm={async () => {
                        if (deletingId) {
                            await handleDelete(deletingId)
                            setOpenWarnModal(false)
                            setDeletingId(null)
                        }
                    }}
                    onCancel={() => {
                        setOpenWarnModal(false)
                        setDeletingId(null)
                    }}
                />
            )}
        </div>
    )
}

export default Community