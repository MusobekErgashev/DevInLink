'use client'

import { ShieldCheck, TriangleAlert, X } from 'lucide-react';
import React, { useEffect } from 'react'

const WarningModal = ({
  confirmText = "Yes",
  cancelText = "No",
  onConfirm,
  onCancel,
  title,
  message,
  description,
  type = "warning"
}) => {
  const content = description || message;
  const isWarning = type === "warning";

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
          <div
            className={`mb-4 flex h-12 w-12 items-center justify-center border transition-all ${
              isWarning
                ? "bg-rose-500/10 text-rose-400 border-rose-500/40"
                : "bg-emerald-500/10 text-emerald-400 border-emerald-500/40"
            }`}
          >
            {isWarning ? (
              <TriangleAlert className="h-6 w-6 stroke-[2]" />
            ) : (
              <ShieldCheck className="h-6 w-6 stroke-[2]" />
            )}
          </div>

          <h2 className="text-lg font-bold text-white tracking-wider uppercase font-mono">
            {title}
          </h2>

          {content && (
            <p className="text-xs text-slate-300 mt-2 font-normal leading-relaxed max-w-xs">
              {content}
            </p>
          )}
        </div>

        <div className="mt-6 flex items-center gap-3">
          {cancelText && (
            <button
              type="button"
              onClick={onCancel}
              className="w-full py-2.5 px-4 text-xs font-semibold uppercase tracking-wider text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/15 cursor-pointer transition-colors"
            >
              {cancelText}
            </button>
          )}
          <button
            type="button"
            onClick={onConfirm}
            className={`w-full py-2.5 px-4 text-xs font-semibold uppercase tracking-wider text-white border cursor-pointer transition-colors ${
              isWarning
                ? "bg-rose-600 hover:bg-rose-700 border-rose-500"
                : "bg-emerald-600 hover:bg-emerald-700 border-emerald-500"
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WarningModal;