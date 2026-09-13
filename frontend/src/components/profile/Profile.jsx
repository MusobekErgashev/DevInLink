'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import {
  Briefcase,
  GraduationCap,
  Code2,
  MapPin,
  Calendar,
  Share2,
  ExternalLink,
  Globe,
  Send,
  Sparkles,
  Check,
  Building2,
  Layers,
  Award,
  Terminal,
  Cpu,
  FileCode2,
  Mail,
  Clock,
  BookOpen,
  User,
  Phone,
  Video,
  Camera,
  AtSign,
} from 'lucide-react'
import api from '@/api/axios'
import Link from 'next/link'
import ShowPhoneModal from '../ShowPhoneModal'

export default function Profile() {
  const [userDetails, setUserDetails] = useState([])
  const user = userDetails[0]
  const [openPhoneModal, setOpenPhoneModal] = useState(false)

  useEffect(() => {
    let isMounted = true
    async function getData() {
      try {
        const res = await api.get('users/me')
        if (res.status === 200 && isMounted) {
          setUserDetails(res.data)
        }
      } catch (err) {
        console.error('Error fetching user details:', err)
      }
    }
    getData()
    return () => {
      isMounted = false
    }
  }, [])

  const [copied, setCopied] = useState(false)

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard?.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const fullName = `${userDetails.first_name || ''} ${userDetails.last_name || ''}`.trim() || 'Muso Ergashev'
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

  // Technology Icon Getter
  const getTechIcon = (name) => {
    const key = (name || '').toLowerCase()
    if (key.includes('html')) return <FileCode2 className="w-5 h-5 text-orange-400" />
    if (key.includes('react')) return <Code2 className="w-5 h-5 text-cyan-400" />
    if (key.includes('next')) return <Layers className="w-5 h-5 text-white" />
    if (key.includes('type') || key.includes('ts')) return <Terminal className="w-5 h-5 text-blue-400" />
    if (key.includes('tail') || key.includes('css')) return <Cpu className="w-5 h-5 text-sky-400" />
    if (key.includes('node')) return <Code2 className="w-5 h-5 text-emerald-400" />
    if (key.includes('postgre') || key.includes('sql') || key.includes('db')) return <Layers className="w-5 h-5 text-indigo-400" />
    if (key.includes('docker')) return <Cpu className="w-5 h-5 text-blue-500" />
    return <Code2 className="w-5 h-5 text-violet-400" />
  }

  return (
    <div className="w-full text-slate-100 font-inter p-4 sm:p-6 flex flex-col gap-0 bg-[#08090e] min-h-screen">
      <section className="w-full border border-white/15 bg-[#0b0c14] relative p-5 sm:p-7 flex flex-col gap-6">
        <div className="flex items-center justify-between border-b border-white/12 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 bg-indigo-500" />
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-indigo-400">
              USER MALUMOTLARI
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

                {user?.total_experience_years !== null && (
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
          <User className="w-4 h-4 text-slate-400" />
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
          <AtSign className="w-4 h-4 text-blue-400" />
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
          <Send className="w-4 h-4 text-sky-400" />
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
          <Video className="w-4 h-4 text-red-400" />
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
          <Camera className="w-4 h-4 text-pink-400" />
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
          <Globe className="w-4 h-4 text-purple-400" />
          <span className="uppercase tracking-wider font-bold">WEBSITE</span>
          {user?.website_url && <ExternalLink className="w-3 h-3 text-slate-500" />}
        </Link>

        <button
          className={`flex items-center justify-center gap-2 py-3 px-4 transition-colors ${user?.phone ? 'hover:bg-purple-600/20 text-slate-200 hover:text-white' : 'opacity-40 cursor-not-allowed text-slate-500'
            }`}
          onClick={(e) => {
            e.preventDefault();
            if (user?.contact_phone && user?.contact_phone !== null) {
              setOpenPhoneModal(true);
            }
          }}
        >
          <Phone className="w-4 h-4 text-indigo-400" />
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
                      {getTechIcon(tech?.name)}
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