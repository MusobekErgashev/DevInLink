'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import {
  Briefcase,
  Code2,
  MapPin,
  Calendar,
  Share2,
  ExternalLink,
  Mail,
  User,
  Phone,
  Eye,
  ShieldCheck,
  Award,
  Layers,
  Terminal,
  Cpu,
  FileCode2,
  Check,
  HeartCrack,
} from 'lucide-react';
import ShowPhoneModal from '../ShowPhoneModal';
import api from '@/api/axios';
import useQueryStore from '@/utils/query.store';
import { useRouter } from 'next/navigation';

const Explore = () => {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [selectedPhone, setSelectedPhone] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const query = useQueryStore((state) => state.query);
  const setTotal = useQueryStore((state) => state.setTotal);
  const [error, setError] = useState("")

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await api.get(`/users?q=${query}`);
        setUsers(res.data);
        setTotal(res.data.total)
        setError("")
      } catch (error) {
        setError(error.response?.data?.message || "Foydalanuvchilar topilmadi!");
      }
    }

    if (query.length) {
      const timer = setTimeout(() => {
        fetchUsers()
      }, 500)
      return () => clearTimeout(timer)
    } else {
      fetchUsers()
    }

  }, [query])

  // Switch user to profile
  const switchUser = (username) => {
    if (username) {
      router.push(`/${username}`);
    }
  };

  // Date formatter
  const formatDate = (dateStr) => {
    if (!dateStr) return 'Noma\'lum';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString('uz-UZ', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  // Copy profile link
  const handleShareProfile = (user) => {
    if (typeof window !== 'undefined') {
      const shareUrl = `${window.location.origin}/${encodeURIComponent(user.username || user.id)}`;
      navigator.clipboard?.writeText(shareUrl);
      setCopiedId(user.id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  return (
    <div className="w-full text-slate-100 mb-7 sm:mb-15 font-inter">
      <div className="border border-white/8 bg-[#0e101c] divide-y divide-white/10 rounded-xl overflow-hidden shadow-2xl">
        {error ? <p className="py-5 text-center text-[18px] text-slate-400 font-mono font-bold uppercase flex justify-center items-center gap-2 h-40 leading-none"><HeartCrack size={22} /> <span className='translate-y-0.5'>{error}</span></p> : users.users?.map((user) => {
          const fullName = `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.username || 'Noma\'lum Dasturchi';
          const formattedName = fullName
            .split(' ')
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
            .join(' ');

          const techList = user.technologies;

          return (
            <div
              key={user.id}
              onClick={() => switchUser(user.username)}
              className="border-b cursor-pointer hover:bg-white/5 transition-colors duration-300 border-white/20 p-2 sm:p-5 flex flex-col sm:flex-row gap-4 items-start relative group"
            >
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="relative w-20 h-20 sm:w-20 sm:h-20 border-2 border-indigo-500/50 bg-[#06070b] shrink-0 flex items-center justify-center overflow-hidden">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={formattedName}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-indigo-950/60 text-indigo-300 font-mono font-bold text-2xl uppercase">
                    {formattedName.charAt(0)}
                  </div>
                )}
                <div className="absolute -top-0.5 -left-0.5 w-1.5 h-1.5 bg-indigo-400" />
                <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-indigo-400" />
                <div className="absolute -bottom-0.5 -left-0.5 w-1.5 h-1.5 bg-indigo-400" />
                <div className="absolute -bottom-0.5 -right-0.5 w-1.5 h-1.5 bg-indigo-400" />
              </div>

              <div className="flex flex-col gap-2 flex-1 min-w-0">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-baseline gap-2">
                    <h1 className="text-base sm:text-lg font-mono font-bold text-white uppercase tracking-tight group-hover:text-indigo-300 transition-colors">
                      {formattedName}
                    </h1>
                    <span className="text-xs font-mono text-indigo-400 font-semibold">
                      @{user.username || 'user'}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs font-mono text-slate-300">
                  {user.job_title && (
                    <div className="flex items-center gap-1.5 px-2 py-0.5 bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 font-semibold">
                      <Briefcase className="w-3.5 h-3.5" />
                      <span>{user.job_title}</span>
                    </div>
                  )}

                  {user.location && (
                    <div className="flex items-center gap-1.5 border border-white/10 px-2 py-0.5 bg-white/5 text-slate-300">
                      <MapPin className="w-3.5 h-3.5 text-rose-400" />
                      <span>{user.location}</span>
                    </div>
                  )}

                  {user.total_experience_years !== undefined && user.total_experience_years !== null && (
                    <div className="flex items-center gap-1.5 border border-white/10 px-2 py-0.5 bg-white/5 text-slate-300 uppercase">
                      <Award className="w-3.5 h-3.5 text-amber-400" />
                      <span>{user?.total_experience_years === 0 ? 'tajribasiz' : `${user?.total_experience_years * 10 < 10 ? `${user?.total_experience_years * 10}+ oylik` : `${user?.total_experience_years} yillik`} tajriba`}</span>
                    </div>
                  )}

                  {user.age && (
                    <div className="flex items-center gap-1.5 border border-white/10 px-2 py-0.5 bg-white/5 text-slate-300">
                      <Calendar className="w-3.5 h-3.5 text-amber-400" />
                      <span>{user.age} yosh</span>
                    </div>
                  )}
                </div>

                {user.headline && (
                  <p className="text-slate-300 text-xs font-mono leading-relaxed border-l-2 border-indigo-500/40 pl-2.5 my-0.5 line-clamp-2">
                    {user.headline}
                  </p>
                )}

                {techList.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5">
                    {techList.map((tech, idx) => (
                      <div
                        key={tech.id || idx}
                        className="border border-white/12 bg-[#06070c] px-2 py-0.5 flex items-center gap-1.5 font-mono text-[11px] text-slate-200 uppercase hover:border-indigo-500/50 transition-colors"
                      >
                        <span>{tech.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className={`flex  items-center gap-2 self-stretch sm:self-center shrink-0 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-white/10`}>
                {user.email && (
                  <a
                    href={`mailto:${user.email}`}
                    onClick={(e) => e.stopPropagation()}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-mono font-bold uppercase tracking-wider bg-indigo-600 hover:bg-indigo-700 text-white border border-indigo-400 transition-colors cursor-pointer"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>MESSAGE</span>
                  </a>
                )}

                <div className="flex items-center gap-1.5">
                  {user.phone && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedPhone(user.phone);
                      }}
                      className="p-1.5 bg-white/5 hover:bg-white/12 text-slate-200 border border-white/15 transition-colors cursor-pointer"
                      title="Kontakt raqami"
                    >
                      <Phone className="w-3.5 h-3.5 text-indigo-400" />
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleShareProfile(user);
                    }}
                    className="p-1.5 bg-white/5 hover:bg-white/12 text-slate-200 border border-white/15 transition-colors cursor-pointer relative"
                    title="Profil havolasini nusxalash"
                  >
                    {copiedId === user.id ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Share2 className="w-3.5 h-3.5" />
                    )}
                    {copiedId === user.id && (
                      <span className="absolute -top-7 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-emerald-600 text-white text-[10px] font-mono font-bold border border-emerald-400 whitespace-nowrap">
                        COPIED!
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Phone Contact Modal */}
      {selectedPhone && (
        <ShowPhoneModal
          onCancel={() => setSelectedPhone(null)}
          message={selectedPhone}
        />
      )}
    </div>
  );
};

export default Explore;