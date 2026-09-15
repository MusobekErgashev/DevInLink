'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { Briefcase, GraduationCap, Code2, MapPin, Calendar, Share2, ExternalLink, Globe, Send, Sparkles, Check, Building2, Layers, Award, Terminal, Cpu, FileCode2, Mail, Clock, BookOpen, User, Phone, Video, Camera, AtSign, ChevronLeft, } from 'lucide-react'
import api from '@/api/axios'
import Link from 'next/link'
import { useParams, useSearchParams, useRouter } from 'next/navigation'
import ShowPhoneModal from './ShowPhoneModal'
import GitHubStats from './stats/GithubStats'
import LeetCodeStats from './stats/LeetcodeStats'
import EducationStats from './stats/EducationStats'
import ExperienceStats from './stats/ExperienceStats'
import TechnologyStats from './stats/TechnologyStats'
import AboutStats from './stats/AboutStats'
import { LinkStats } from './stats/LinkStats'

export default function UserDetails({ username: propUsername }) {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const targetUsername = propUsername || params?.username || searchParams?.get('user')

  const [userDetails, setUserDetails] = useState([])
  const user = userDetails[0]
  const [openPhoneModal, setOpenPhoneModal] = useState(false)
  const [leetcodeStats, setLeetcodeStats] = useState(null)
  const [leetcodeLoading, setLeetcodeLoading] = useState(false)

  useEffect(() => {
    let isMounted = true
    async function getData() {
      try {
        const endpoint = targetUsername ? `users/${encodeURIComponent(targetUsername)}` : 'users/me'
        const res = await api.get(endpoint)
        if (res.status === 200 && isMounted) {
          const data = Array.isArray(res.data) ? res.data : [res.data]
          setUserDetails(data)
        }
      } catch (err) {
        if (isMounted) {
          toast.error(err.response?.data?.message || 'Foydalanuvchi ma\'lumotlarini yuklashda xatolik')
        }
      }
    }
    getData()
    return () => {
      isMounted = false
    }
  }, [targetUsername])

  useEffect(() => {
    if (!user?.id) return;
    let isMounted = true
    async function fetchLeetcode() {
      try {
        setLeetcodeLoading(true)
        const res = await api.get(`leetcode/user/${user.id}`)
        if (res.status === 200 && isMounted) {
          setLeetcodeStats(res.data)
        }
      } catch (err) {
        if (isMounted) setLeetcodeStats(null)
      } finally {
        if (isMounted) setLeetcodeLoading(false)
      }
    }
    fetchLeetcode()
    return () => {
      isMounted = false
    }
  }, [user?.id])

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

      {/* links */}

      <LinkStats user={user} />

      {user?.about && (
        <AboutStats about={user?.about} />
      )}

      <section className="w-full grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-white/15 border-x border-b border-white/15 bg-[#08090e]">
        {/* technologies */}

        <TechnologyStats technologies={user?.technologies} />

        {/* experience */}

        <ExperienceStats formatDate={formatDate} experience={user?.experience} totalExperienceYears={user?.total_experience_years} />

        {/* education */}

        <EducationStats formatDate={formatDate} education={user?.education} />
      </section>

      {/* leetcode */}

      {
        user?.leetcode_username && (
          <LeetCodeStats leetcodeLoading={leetcodeLoading} leetcodeStats={leetcodeStats} />
        )
      }

      {/* github */}

      {
        user?.github_username && (
          <GitHubStats username={user?.github_username} />
        )
      }

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