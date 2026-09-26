'use client';

import React, { Suspense } from 'react';
import UserDetails from '@/components/UserDetails';
import { useParams } from 'next/navigation';

function UserProfileContent() {
  const params = useParams();
  const username = params?.username;

  return <UserDetails username={username} />;
}

const ProfileSkeleton = () => (
  <div className="w-full text-slate-100 font-inter p-3 sm:p-5 lg:p-6 flex flex-col gap-6 bg-[#08090e] min-h-screen animate-pulse">
    <div className="w-full border border-white/15 bg-[#0b0c14] p-4 sm:p-6 lg:p-7 flex flex-col gap-6">
      <div className="flex items-center justify-between border-b border-white/12 pb-3">
        <div className="w-20 h-4 bg-white/10" />
        <div className="w-36 h-3 bg-white/5" />
      </div>
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 w-full lg:w-auto">
          <div className="w-20 h-20 sm:w-28 sm:h-28 border-2 border-indigo-500/30 bg-white/10 shrink-0" />
          <div className="flex flex-col gap-3 flex-1">
            <div className="w-48 sm:w-64 h-7 bg-white/10" />
            <div className="flex flex-wrap gap-2">
              <div className="w-28 h-6 bg-white/5" />
              <div className="w-24 h-6 bg-white/5" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default function UserProfilePage() {
  return (
    <div className="h-full w-full rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.4)] overflow-hidden overflow-y-auto border border-white/8 scrollbar-none">
      <Suspense fallback={<ProfileSkeleton />}>
        <UserProfileContent />
      </Suspense>
    </div>
  );
}
