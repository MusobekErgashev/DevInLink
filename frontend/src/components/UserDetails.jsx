'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { Briefcase, GraduationCap, Code2, MapPin, Calendar, Share2, ExternalLink, Globe, Send, Sparkles, Check, Building2, Layers, Award, Terminal, Cpu, FileCode2, Mail, Clock, BookOpen, User, Phone, Video, Camera, AtSign, ChevronLeft, } from 'lucide-react'
import api from '@/api/axios'
import Link from 'next/link'
import { useParams, useSearchParams, useRouter } from 'next/navigation'
import ShowPhoneModal from './ShowPhoneModal'

export default function UserDetails({ username: propUsername }) {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const targetUsername = propUsername || params?.username || searchParams?.get('user')

  const [userDetails, setUserDetails] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const user = userDetails[0]
  const [openPhoneModal, setOpenPhoneModal] = useState(false)

  useEffect(() => {
    let isMounted = true
    async function getData() {
      try {
        setLoading(true)
        setError(null)
        const endpoint = targetUsername ? `users/${encodeURIComponent(targetUsername)}` : 'users/me'
        const res = await api.get(endpoint)
        if (res.status === 200 && isMounted) {
          const data = Array.isArray(res.data) ? res.data : [res.data]
          setUserDetails(data)
        }
      } catch (err) {
        console.error('Error fetching user details:', err)
        if (isMounted) {
          setError(err.response?.data?.message || 'Foydalanuvchi ma\'lumotlarini yuklashda xatolik')
        }
      } finally {
        if (isMounted) setLoading(false)
      }
    }
    getData()
    return () => {
      isMounted = false
    }
  }, [targetUsername])

  const [copied, setCopied] = useState(false)

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard?.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const fullName = `${user?.first_name || ''} ${user?.last_name || ''}`.trim() || 'User'
  const formattedName = fullName.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ')

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Unknown'
    try {
      const d = new Date(dateStr)
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    } catch {
      return dateStr
    }
  }

  return (
    <div className="w-full text-slate-100 font-inter p-4 sm:p-6 flex flex-col gap-0 bg-[#08090e] min-h-screen">
      <section className="w-full border border-white/15 bg-[#0b0c14] relative p-5 sm:p-7 flex flex-col gap-6">
        <div className="flex items-center justify-between border-b border-white/12 pb-3">
          <div className="flex items-center gap-2 cursor-pointer hover:text-indigo-500 transition-colors duration-300" onClick={() => router.back()}>
            <ChevronLeft size={20} className="-translate-y-0.5" />
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-indigo-400">
              ortga
            </span>
          </div>
          <span className="text-[11px] font-mono text-slate-400 uppercase tracking-widest">
            {`qo'shilgan sana - ${formatDate(user?.created_at)}`}
          </span>
        </div>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-5">
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 border-2 border-indigo-500/60 bg-[#06070b] shrink-0 flex items-center justify-center">
              {user?.avatar ? (
                <Image
                  src={user?.avatar}
                  alt={formattedName}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-indigo-950/60 text-indigo-300 font-mono font-bold text-3xl">
                  {formattedName.charAt(0)}
                </div>
              )}
              <div className="absolute -top-1 -left-1 w-2 h-2 bg-indigo-400" />
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-indigo-400" />
              <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-indigo-400" />
              <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-indigo-400" />
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex flex-wrap items-baseline gap-3">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight uppercase font-mono">
                  {formattedName || 'YUKLANMOQDA...'}
                </h1>
                <span className="text-sm font-mono text-indigo-400 font-semibold">
                  @{user?.username || 'user'}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-300 font-mono">
                {user?.job_title && (
                  <div className="flex items-center gap-1.5 px-2.5 py-1 bg-indigo-500/10 border border-indigo-500/30 text-indigo-300">
                    <Briefcase className="w-3.5 h-3.5" />
                    <span>{user?.job_title}</span>
                  </div>
                )}

                {user?.location && (
                  <div className="flex items-center gap-1.5 text-slate-400 border border-white/10 px-2.5 py-1 bg-white/5">
                    <MapPin className="w-3.5 h-3.5 text-rose-400" />
                    <span>{user?.location}</span>
                  </div>
                )}

                {user?.total_experience_years !== null && user?.total_experience_years !== undefined && (
                  <div className="flex items-center gap-1.5 text-slate-400 uppercase border border-white/10 px-2.5 py-1 bg-white/5">
                    <Award className="w-3.5 h-3.5 text-amber-400" />
                    <span>{user?.total_experience_years === 0 ? 'tajribasiz' : `${user?.total_experience_years}+ yillik tajriba`}</span>
                  </div>
                )}

                {user?.age && (
                  <div className="flex items-center gap-1.5 text-slate-400 border border-white/10 px-2.5 py-1 bg-white/5">
                    <Calendar className="w-3.5 h-3.5 text-amber-400" />
                    <span>{user?.age} yosh</span>
                  </div>
                )}
              </div>

              {user?.headline && (
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-3xl font-normal mt-1 border-l-2 border-indigo-500/40 pl-3">
                  {user?.headline}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto shrink-0 pt-2 md:pt-0">
            <a
              href={`mailto:${user?.email}`}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-mono font-bold uppercase tracking-wider bg-indigo-600 hover:bg-indigo-700 text-white border border-indigo-400 transition-colors cursor-pointer"
            >
              <Mail className="w-4 h-4" />
              <span>MESSAGE</span>
            </a>

            <button
              onClick={handleShare}
              className="p-2.5 bg-white/5 hover:bg-white/12 text-slate-200 border border-white/15 transition-colors cursor-pointer relative"
              title="Share Profile"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
              {copied && (
                <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-emerald-600 text-white text-[10px] font-mono font-bold border border-emerald-400 whitespace-nowrap">
                  COPIED!
                </span>
              )}
            </button>
          </div>
        </div>
      </section>

      <section className="w-full border-x border-b border-white/15 bg-[#0e101c] grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 divide-x divide-y sm:divide-y-0 divide-white/12 font-mono text-xs">
        <Link
          href={user?.github_url || ''}
          target={user?.github_url ? '_blank' : ''}
          rel="noopener noreferrer"
          className={`flex items-center justify-center gap-2 py-3 px-4 transition-colors ${user?.github_url ? 'hover:bg-indigo-600/20 text-slate-200 hover:text-white' : 'opacity-40 cursor-not-allowed text-slate-500'
            }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-slate-200 shrink-0" fill="currentColor" viewBox="0 0 16 16">
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8" />
          </svg>
          <span className="uppercase tracking-wider font-bold">GITHUB</span>
          {user?.github_url && <ExternalLink className="w-3 h-3 text-slate-500" />}
        </Link>

        <Link
          href={user?.linkedin_url || ''}
          target={user?.linkedin_url ? '_blank' : ''}
          rel="noopener noreferrer"
          className={`flex items-center justify-center gap-2 py-3 px-4 transition-colors ${user?.linkedin_url ? 'hover:bg-blue-600/20 text-slate-200 hover:text-white' : 'opacity-40 cursor-not-allowed text-slate-500'
            }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-blue-400 shrink-0" fill="currentColor" viewBox="0 0 16 16">
            <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854zm4.943 12.248V6.169H2.542v7.225zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248S2.4 3.226 2.4 3.934c0 .694.521 1.248 1.327 1.248zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016l.016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225z" />
          </svg>
          <span className="uppercase tracking-wider font-bold">LINKEDIN</span>
          {user?.linkedin_url && <ExternalLink className="w-3 h-3 text-slate-500" />}
        </Link>

        <Link
          href={user?.telegram_url || ''}
          target={user?.telegram_url ? '_blank' : ''}
          rel="noopener noreferrer"
          className={`flex items-center justify-center gap-2 py-3 px-4 transition-colors ${user?.telegram_url ? 'hover:bg-sky-600/20 text-slate-200 hover:text-white' : 'opacity-40 cursor-not-allowed text-slate-500'
            }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-sky-400 shrink-0" fill="currentColor" viewBox="0 0 16 16">
            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.287 5.906q-1.168.486-4.666 2.01-.567.225-.595.442c-.03.243.275.339.69.47l.175.055c.408.133.958.288 1.243.294q.39.01.868-.32 3.269-2.206 3.374-2.23c.05-.012.12-.026.166.016s.042.12.037.141c-.03.129-1.227 1.241-1.846 1.817-.193.18-.33.307-.358.336a8 8 0 0 1-.188.186c-.38.366-.664.64.015 1.088.327.216.589.393.85.571.284.194.568.387.936.629q.14.092.27.187c.331.236.63.448.997.414.214-.02.435-.22.547-.82.265-1.417.786-4.486.906-5.751a1.4 1.4 0 0 0-.013-.315.34.34 0 0 0-.114-.217.53.53 0 0 0-.31-.093c-.3.005-.763.166-2.984 1.09" />
          </svg>
          <span className="uppercase tracking-wider font-bold">TELEGRAM</span>
          {user?.telegram_url && <ExternalLink className="w-3 h-3 text-slate-500" />}
        </Link>

        <Link
          href={user?.youtube_url || ''}
          target={user?.youtube_url ? '_blank' : ''}
          rel="noopener noreferrer"
          className={`flex items-center justify-center gap-2 py-3 px-4 transition-colors ${user?.youtube_url ? 'hover:bg-red-600/20 text-slate-200 hover:text-white' : 'opacity-40 cursor-not-allowed text-slate-500'
            }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-red-500 shrink-0" fill="currentColor" viewBox="0 0 16 16">
            <path d="M8.051 1.999h.089c.822.003 4.987.033 6.11.335a2.01 2.01 0 0 1 1.415 1.42c.101.38.172.883.22 1.402l.01.104.022.26.008.104c.065.914.073 1.77.074 1.957v.075c-.001.194-.01 1.108-.082 2.06l-.008.105-.009.104c-.05.572-.124 1.14-.235 1.558a2.01 2.01 0 0 1-1.415 1.42c-1.16.312-5.569.334-6.18.335h-.142c-.309 0-1.587-.006-2.927-.052l-.17-.006-.087-.004-.171-.007-.171-.007c-1.11-.049-2.167-.128-2.654-.26a2.01 2.01 0 0 1-1.415-1.419c-.111-.417-.185-.986-.235-1.558L.09 9.82l-.008-.104A31 31 0 0 1 0 7.68v-.123c.002-.215.01-.958.064-1.778l.007-.103.003-.052.008-.104.022-.26.01-.104c.048-.519.119-1.023.22-1.402a2.01 2.01 0 0 1 1.415-1.42c.487-.13 1.544-.21 2.654-.26l.17-.007.172-.006.086-.003.171-.007A100 100 0 0 1 7.858 2zM6.4 5.209v4.818l4.157-2.408z" />
          </svg>
          <span className="uppercase tracking-wider font-bold">YOUTUBE</span>
          {user?.youtube_url && <ExternalLink className="w-3 h-3 text-slate-500" />}
        </Link>

        <Link
          href={user?.instagram_url || ''}
          target={user?.instagram_url ? '_blank' : ''}
          rel="noopener noreferrer"
          className={`flex items-center justify-center gap-2 py-3 px-4 transition-colors ${user?.instagram_url ? 'hover:bg-pink-600/20 text-slate-200 hover:text-white' : 'opacity-40 cursor-not-allowed text-slate-500'
            }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-pink-500 shrink-0" fill="currentColor" viewBox="0 0 16 16">
            <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.9 3.9 0 0 0-1.417.923A3.9 3.9 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.9 3.9 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.9 3.9 0 0 0-.923-1.417A3.9 3.9 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599s.453.546.598.92c.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.5 2.5 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.5 2.5 0 0 1-.92-.598 2.5 2.5 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233s.008-2.388.046-3.231c.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92s.546-.453.92-.598c.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92m-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217m0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334" />
          </svg>
          <span className="uppercase tracking-wider font-bold">INSTAGRAM</span>
          {user?.instagram_url && <ExternalLink className="w-3 h-3 text-slate-500" />}
        </Link>

        <Link
          href={user?.website_url || ''}
          target={user?.website_url ? '_blank' : ''}
          rel="noopener noreferrer"
          className={`flex items-center justify-center gap-2 py-3 px-4 transition-colors ${user?.website_url ? 'hover:bg-purple-600/20 text-slate-200 hover:text-white' : 'opacity-40 cursor-not-allowed text-slate-500'
            }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-purple-400 shrink-0" fill="currentColor" viewBox="0 0 16 16">
            <path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m7.5-6.923c-.67.204-1.335.82-1.887 1.855q-.215.403-.395.872c.705.157 1.472.257 2.282.287zM4.249 3.539q.214-.577.481-1.078a7 7 0 0 1 .597-.933A7 7 0 0 0 3.051 3.05q.544.277 1.198.49zM3.509 7.5c.036-1.07.188-2.087.436-3.008a9 9 0 0 1-1.565-.667A6.96 6.96 0 0 0 1.018 7.5zm1.4-2.741a12.3 12.3 0 0 0-.4 2.741H7.5V5.091c-.91-.03-1.783-.145-2.591-.332M8.5 5.09V7.5h2.99a12.3 12.3 0 0 0-.399-2.741c-.808.187-1.681.301-2.591.332zM4.51 8.5c.035.987.176 1.914.399 2.741A13.6 13.6 0 0 1 7.5 10.91V8.5zm3.99 0v2.409c.91.03 1.783.145 2.591.332.223-.827.364-1.754.4-2.741zm-3.282 3.696q.18.469.395.872c.552 1.035 1.218 1.65 1.887 1.855V11.91c-.81.03-1.577.13-2.282.287zm.11 2.276a7 7 0 0 1-.598-.933 9 9 0 0 1-.481-1.079 8.4 8.4 0 0 0-1.198.49 7 7 0 0 0 2.276 1.522zm-1.383-2.964A13.4 13.4 0 0 1 3.508 8.5h-2.49a6.96 6.96 0 0 0 1.362 3.675c.47-.258.995-.482 1.565-.667m6.728 2.964a7 7 0 0 0 2.275-1.521 8.4 8.4 0 0 0-1.197-.49 9 9 0 0 1-.481 1.078 7 7 0 0 1-.597.933M8.5 11.909v3.014c.67-.204 1.335-.82 1.887-1.855q.216-.403.395-.872A12.6 12.6 0 0 0 8.5 11.91zm3.555-.401c.57.185 1.095.409 1.565.667A6.96 6.96 0 0 0 14.982 8.5h-2.49a13.4 13.4 0 0 1-.437 3.008M14.982 7.5a6.96 6.96 0 0 0-1.362-3.675c-.47.258-.995.482-1.565.667.248.92.4 1.938.437 3.008zM11.27 2.461q.266.502.482 1.078a8.4 8.4 0 0 0 1.196-.49 7 7 0 0 0-2.275-1.52c.218.283.418.597.597.932m-.488 1.343a8 8 0 0 0-.395-.872C9.835 1.897 9.17 1.282 8.5 1.077V4.09c.81-.03 1.577-.13 2.282-.287z" />
          </svg>
          <span className="uppercase tracking-wider font-bold">WEBSITE</span>
          {user?.website_url && <ExternalLink className="w-3 h-3 text-slate-500" />}
        </Link>

        <button
          className={`flex items-center justify-center gap-2 py-3 px-4 transition-colors ${user?.phone || user?.contact_phone ? 'hover:bg-purple-600/20 text-slate-200 hover:text-white' : 'opacity-40 cursor-not-allowed text-slate-500'
            }`}
          onClick={(e) => {
            e.preventDefault();
            if (user?.contact_phone || user?.phone) {
              setOpenPhoneModal(true);
            }
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-emerald-400 shrink-0" fill="currentColor" viewBox="0 0 16 16">
            <path d="M3.654 1.328a.678.678 0 0 0-1.015-.063L1.605 2.3c-.483.484-.661 1.169-.45 1.77a17.6 17.6 0 0 0 4.168 6.608 17.6 17.6 0 0 0 6.608 4.168c.601.211 1.286.033 1.77-.45l1.034-1.034a.678.678 0 0 0-.063-1.015l-2.307-1.794a.68.68 0 0 0-.58-.122l-2.19.547a1.75 1.75 0 0 1-1.657-.459L5.482 8.062a1.75 1.75 0 0 1-.46-1.657l.548-2.19a.68.68 0 0 0-.122-.58zM1.884.511a1.745 1.745 0 0 1 2.612.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.68.68 0 0 0 .178.643l2.457 2.457a.68.68 0 0 0 .644.178l2.189-.547a1.75 1.75 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.6 18.6 0 0 1-7.01-4.42 18.6 18.6 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877z" />
          </svg>
          <span className="uppercase tracking-wider font-bold">CONTACT</span>
        </button>

      </section>

      <section className="w-full grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-white/15 border-x border-b border-white/15 bg-[#08090e]">
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
                {user?.technologies?.length || 0}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {user?.technologies && user?.technologies.length > 0 ? (
                user?.technologies.map((tech) => (
                  <div
                    key={tech?.id}
                    className="border border-white/10 bg-[#0e101b] hover:bg-indigo-600/15 hover:border-indigo-500/50 transition-colors p-3 flex flex-col items-center justify-center gap-2 text-center group cursor-pointer"
                  >
                    <div className="group-hover:scale-110 transition-transform">
                      {/* {getTechIcon(tech?.name)} */}
                    </div>
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

          <div className="border border-white/12 bg-[#0e101c] p-4 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-indigo-300 uppercase tracking-wider border-b border-white/10 pb-2">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>DEVELOPER SUMMARY</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed font-mono">
              {user?.technologies?.summary || 'Frontend & Backend texnologiyalari bo&apos;yicha tajribali dasturchi profile kartochkasi.'}
            </p>
          </div>
        </div>

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
                {user?.experience?.length || 0} JOBS
              </span>
            </div>

            <div className="flex flex-col gap-3">
              {user?.experience && user?.experience.length > 0 ? (
                user?.experience.map((exp) => (
                  <div
                    key={exp?.id}
                    className="border border-white/12 bg-[#0e101b] hover:border-indigo-500/40 p-4 flex flex-col gap-2.5 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <h3 className="text-xs font-mono font-bold uppercase text-white tracking-wider">
                        {exp?.title}
                      </h3>
                      <span className="text-[10px] font-mono text-indigo-300 border border-indigo-500/30 px-2 py-0.5 bg-indigo-500/10 w-fit">
                        {formatDate(exp?.start_date)} - {formatDate(exp?.end_date)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
                      <Building2 className="w-3.5 h-3.5 text-indigo-400" />
                      <span>{exp?.company}</span>
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
              <span className="font-bold text-white">{user?.total_experience_years || 0} yil</span>
            </div>
          </div>

        </div>

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
                {user?.education?.length || 0}
              </span>
            </div>

            <div className="flex flex-col gap-3">
              {user?.education && user?.education.length > 0 ? (
                user?.education.map((item) => (
                  <div
                    key={item?.id}
                    className="border border-white/12 bg-[#0e101b] hover:border-indigo-500/40 p-4 flex flex-col gap-2.5 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <h3 className="text-xs font-mono font-bold uppercase text-white tracking-wider">
                        {item?.education_place || 'AKADEMIYA / O&apos;QUV MARKAZI'}
                      </h3>
                      <span className="text-[10px] font-mono text-purple-300 border border-purple-500/30 px-2 py-0.5 bg-purple-500/10 w-fit">
                        {formatDate(item?.start_date)} - {formatDate(item?.end_date)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
                      <BookOpen className="w-3.5 h-3.5 text-purple-400" />
                      <span>DARAZA: {item?.degree}</span>
                      {item?.location && (
                        <>
                          <span>•</span>
                          <span className="uppercase">{item?.location}</span>
                        </>
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

          <div className="border border-white/12 bg-[#0e101c] p-4 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-purple-300 uppercase tracking-wider border-b border-white/10 pb-2">
              <BookOpen className="w-3.5 h-3.5 text-purple-400" />
              <span>CERTIFICATIONS & BADGES</span>
            </div>
            <p className="text-slate-400 text-xs font-mono">
              Rasmiy sertifikatlar hamda akademik muvaffaqiyatlar ro&apos;yxati.
            </p>
          </div>

        </div>

      </section>

      {
        openPhoneModal && (
          <ShowPhoneModal
            onCancel={() => setOpenPhoneModal(false)}
            message={userDetails?.contact_phone}
          />
        )
      }
    </div>
  )
}