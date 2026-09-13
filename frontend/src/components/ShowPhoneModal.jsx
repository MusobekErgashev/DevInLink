'use client'

import { Check, Copy, Phone, ShieldCheck, TriangleAlert, X } from 'lucide-react';
import React, { useEffect, useState } from 'react'

const ShowPhoneModal = ({
    message,
    onCancel,
    description,
}) => {
    const content = description || message;
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(content);
        setCopied(true);
    };

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') onCancel?.();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onCancel]);

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 animate-in fade-in duration-200"
            onClick={onCancel}
        >
            <div
                className="relative w-full max-w-md bg-[#0e101b] border border-white/20 p-6 shadow-2xl animate-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button */}
                <button
                    type="button"
                    onClick={onCancel}
                    className="absolute top-4 right-4 p-1.5 border border-white/10 text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
                >
                    <X className="w-4 h-4" />
                </button>

                <div className="flex flex-col items-center text-center pt-2">
                    {/* Icon badge */}
                    <div className={`mb-4 flex h-12 w-12 items-center justify-center border transition-all bg-emerald-500/10 text-emerald-400 border-emerald-500/40`}>
                        <Phone className="w-5 h-5" />
                    </div>

                    <h2 className="text-lg font-bold text-white tracking-wider uppercase font-mono">
                        {content ? (
                            <p className="text-xs text-slate-300 mt-2 font-normal leading-relaxed max-w-xs">
                                {content}
                            </p>
                        ) : "RAQAM TOPILMADI!"}
                    </h2>
                </div>

                <div className="mt-6 flex items-center gap-3">
                    <button
                        type="button"
                        onClick={handleCopy}
                        className={`w-full py-2.5 px-4 text-xs font-semibold uppercase tracking-wider text-white border cursor-pointer transition-colors bg-emerald-600 hover:bg-emerald-700 border-emerald-500`}
                    >
                        <span className="relative flex items-center justify-center gap-2">
                            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                            {copied ? 'nusxalandi' : 'nusxalash'}
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ShowPhoneModal;