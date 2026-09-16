import { X, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react'
import React, { useState } from 'react'

const ImageViewer = ({ src, onCancel }) => {
    const [zoom, setZoom] = useState(100)

    const handleZoomIn = () => setZoom(prev => Math.min(Number(prev) + 15, 250))
    const handleZoomOut = () => setZoom(prev => Math.max(Number(prev) - 15, 100))

    return (
        <div
            className='w-full h-screen fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 select-none'
            onClick={onCancel}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className='relative max-w-[90vw] max-h-[85vh] flex gap-4 sm:gap-6 items-center justify-center'
            >
                {/* Image Frame */}
                <div className='relative border-2 border-indigo-500/60 bg-[#06070b] overflow-hidden max-w-[75vw] max-h-[80vh] flex items-center justify-center shadow-2xl shadow-indigo-500/10'>
                    <img
                        src={src}
                        alt="Preview"
                        className="max-w-full max-h-[75vh] object-contain transition-transform duration-150 ease-out"
                        style={{ transform: `scale(${zoom / 100})` }}
                    />
                </div>

                <div className='flex flex-col items-center gap-3 bg-panel/90 border border-indigo-500/40 p-3 backdrop-blur-md shrink-0 shadow-lg'>
                    <button
                        onClick={onCancel}
                        title="Yopish (Esc)"
                        className='p-2 bg-rose-500/10 border border-rose-500/40 text-rose-400 hover:bg-rose-500/20 hover:border-rose-500 transition-all cursor-pointer'
                    >
                        <X size={20} />
                    </button>

                    <div className="w-full h-px bg-indigo-500/20" />

                    <button
                        onClick={handleZoomIn}
                        title="Kattalashtirish"
                        className="p-1.5 bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/20 hover:text-white transition-all cursor-pointer"
                    >
                        <ZoomIn size={18} />
                    </button>

                    <div className="h-36 flex items-center justify-center my-1 w-6">
                        <input
                            type="range"
                            min={100}
                            max={250}
                            value={zoom}
                            onChange={(e) => setZoom(e.target.value)}
                            className='-rotate-90 w-32 h-1.5 bg-slate-800 accent-indigo-500 cursor-pointer appearance-none'
                        />
                    </div>

                    <button
                        onClick={handleZoomOut}
                        title="Kichiklashtirish"
                        className="p-1.5 bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/20 hover:text-white transition-all cursor-pointer"
                    >
                        <ZoomOut size={18} />
                    </button>

                    <div className="w-full h-px bg-indigo-500/20" />

                    <span className="text-[11px] font-mono text-indigo-400 font-bold">
                        {zoom}%
                    </span>

                    <button
                        onClick={() => setZoom(100)}
                        title="Boshlang'ich holat"
                        className="p-1.5 bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white transition-all cursor-pointer"
                    >
                        <RotateCcw size={14} />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ImageViewer