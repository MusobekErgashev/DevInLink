'use client'

import { pages } from '@/app/pages-export'
import { ChevronLeft, CircleUserRound, LogOut, PanelLeftClose, PanelLeftOpen } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import React, { useState } from 'react'
import useMenuStore from '@/utils/menu.store'
import api from '@/api/axios'
import WarningModal from './WarningModal'

const Menu = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isWarningModalOpen, setIsWarningModalOpen] = useState(false);
  const { toggleMenu, isOpen } = useMenuStore();

  const handleLogout = async () => {
    try {
      await api.post('auth/logout')
    } catch (error) {
      console.error('Logout error:', error)
    }
    router.push('/auth')
  }

  return (
    <aside
      className={`h-full font-inter flex flex-col justify-between bg-[#0b0c14] border-r border-white/12 relative transition-all duration-300 z-30 shrink-0 ${isOpen ? 'w-68' : 'w-18'
        }`}
    >
      <button
        onClick={toggleMenu}
        className="absolute top-12.5 -right-3.5 z-50 p-1 border border-white/20 bg-[#0e101b] hover:bg-indigo-600 hover:border-indigo-400 text-slate-300 hover:text-white transition-all cursor-pointer shadow-md"
        title={isOpen ? "Collapse Menu" : "Expand Menu"}
      >
        {isOpen ? <PanelLeftClose size={16} /> : <PanelLeftOpen size={16} />}
      </button>

      <div className={`flex items-center h-16 px-4 border-b border-white/12 bg-[#0e101b]`}>
        <Link href="/explore" className={`flex items-center ${isOpen ? '' : 'mx-auto'} gap-2 overflow-hidden`}>
          <div className="flex items-center justify-center shrink-0">
            <Image src="/favicon.ico" alt="Logo Icon" width={35} height={35} className="object-contain" />
          </div>
          {isOpen && (
            <span className="font-bold text-[18px] tracking-wider uppercase text-white truncate font-mono">
              DevInLink
            </span>
          )}
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto py-4 flex flex-col gap-1 px-2">
        <nav className="flex flex-col gap-1">
          {pages.map((item) => {
            const isActive = pathname === item.path
            return (
              <Link
                href={item.path}
                key={item.id}
                className={`relative group flex items-center ${isOpen ? 'gap-3 px-3.5' : 'justify-center px-0'
                  } py-2.5 transition-colors duration-150 text-xs font-mono uppercase tracking-wider ${isActive
                    ? 'bg-indigo-500/10 text-indigo-400 font-bold border-l-2 border-indigo-500'
                    : 'text-slate-400 font-medium hover:text-slate-200 hover:bg-white/5'
                  }`}
              >
                <div
                  className={`w-5 h-5 flex items-center justify-center shrink-0 ${isActive ? 'text-indigo-400' : 'text-slate-400 group-hover:text-slate-200'
                    }`}
                >
                  {item.icon}
                </div>
                {isOpen ? (
                  <span className="truncate">{item.title}</span>
                ) : (
                  <span className="absolute left-full ml-2 z-50 px-2.5 py-1 bg-[#0e101b] border border-white/15 text-slate-200 text-[11px] font-mono whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-150 shadow-md">
                    {item.title}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>
      </div>

      <div className="p-2 border-t border-white/12 bg-[#0e101b] flex flex-col gap-1">
        {(() => {
          const isProfileActive = pathname === '/profile'
          return (
            <Link
              href="/profile"
              className={`relative group flex items-center ${isOpen ? 'gap-3 px-3.5' : 'justify-center px-0'
                } py-2.5 transition-colors duration-150 text-xs font-mono uppercase tracking-wider ${isProfileActive
                  ? 'bg-indigo-500/10 text-indigo-400 font-bold border-l-2 border-indigo-500'
                  : 'text-slate-400 font-medium hover:text-slate-200 hover:bg-white/5'
                }`}
            >
              <div
                className={`w-5 h-5 flex items-center justify-center shrink-0 ${isProfileActive ? 'text-indigo-400' : 'text-slate-400 group-hover:text-slate-200'
                  }`}
              >
                <CircleUserRound size={20} />
              </div>
              {isOpen ? (
                <span className="truncate">PROFILE</span>
              ) : (
                <span className="absolute left-full ml-2 z-50 px-2.5 py-1 bg-[#0e101b] border border-white/15 text-slate-200 text-[11px] font-mono whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-150 shadow-md">
                  PROFILE
                </span>
              )}
            </Link>
          )
        })()}

        <button
          onClick={() => setIsWarningModalOpen(true)}
          className={`relative group flex items-center ${isOpen ? 'gap-3 px-3.5' : 'justify-center px-0'
            } py-2.5 transition-colors duration-150 text-xs font-mono font-medium uppercase tracking-wider text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 cursor-pointer w-full text-left`}
        >
          <div className="w-5 h-5 flex items-center justify-center shrink-0 text-rose-400">
            <LogOut size={18} />
          </div>
          {isOpen ? (
            <span className="truncate">LOGOUT</span>
          ) : (
            <span className="absolute left-full ml-2 z-50 px-2.5 py-1 bg-[#0e101b] border border-rose-500/30 text-rose-300 text-[11px] font-mono whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-150 shadow-md">
              LOGOUT
            </span>
          )}
        </button>
      </div>

      {isWarningModalOpen && (
        <WarningModal
          confirmText="Ha"
          cancelText="Yo'q"
          onConfirm={() => {
            setIsWarningModalOpen(false)
            handleLogout()
          }}
          onCancel={() => setIsWarningModalOpen(false)}
          title="LOGOUT"
          description="Rostdan ham tizimdan chiqishni xohlaysizmi?"
          type="warning"
        />
      )}
    </aside>
  )
}

export default Menu