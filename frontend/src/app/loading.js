'use client'

import { Loader2 } from 'lucide-react'
import React, { useState, useEffect } from 'react'

const Loading = () => {
  const [showLoading, setShowLoading] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoading(true)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  if (!showLoading) return null

  return (
    <div className='w-full h-screen fixed top-0 left-0 z-50 bg-black/40 flex items-center justify-center'>
      <div className='flex items-center gap-2 bg-[#0e101b] px-5 py-4 rounded-lg border border-white/12 shadow-2xl'>
        <Loader2 className='animate-spin' size={24} />
        <span className='text-slate-300 font-mono font-bold text-sm'>Yuklanmoqda...</span>
      </div>
    </div>
  )
}

export default Loading