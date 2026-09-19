import Quotes from '@/components/quotes/Quotes'
import React from 'react'

export const metadata = {
  title: 'Iqtiboslar | DevInLink',
  description: 'Zamonaviy kasb egalaridan iqtiboslar',
}

const page = () => {
  return (
    <div className="w-full min-h-screen bg-[#08090e] p-4 sm:p-6 font-inter">
      <Quotes />
    </div>
  )
}

export default page