'use client';

import React, { Suspense } from 'react';
import UserDetails from '@/components/UserDetails';
import { useParams } from 'next/navigation';

function UserProfileContent() {
  const params = useParams();
  const username = params?.username;

  return <UserDetails username={username} />;
}

export default function UserProfilePage() {
  return (
    <div className="h-full w-full rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.4)] overflow-hidden overflow-y-auto border border-white/8 scrollbar-none">
      <Suspense fallback={<div className="p-8 text-center font-mono text-slate-400">YUKLANMOQDA...</div>}>
        <UserProfileContent />
      </Suspense>
    </div>
  );
}
