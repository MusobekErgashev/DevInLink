import { ShieldAlert, Zap } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const NotFound = () => {
    return (
        <div className="h-screen flex fixed top-0 left-0 z-50 w-full items-center justify-center bg-zinc-950 text-zinc-100">
            <div className='flex flex-col items-center gap-2'>
                <h1 className='text-rose-500'><ShieldAlert size={64} /></h1>
                <p className='text-slate-400 font-mono font-bold text-xl uppercase'>sahifa topilmadi</p>
                <Link href="/explore" className='text-indigo-400 font-mono font-bold text-lg uppercase hover:underline'>Bosh sahifaga qaytish</Link>
            </div>
        </div>
    )
}

export default NotFound