import { Zap } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const NotFound = () => {
    return (
        <div className="h-screen flex fixed top-0 left-0 w-full items-center justify-center bg-zinc-950 text-zinc-100">
            <div className='flex flex-col items-center gap-2'>
                <h1>not found</h1>
            </div>
        </div>
    )
}

export default NotFound