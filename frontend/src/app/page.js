'use client'

import React from 'react'
import { useRouter } from 'next/navigation'

const Page = () => {
  const router = useRouter()
  React.useEffect(() => {
    router.push('/profile')
  }, [router])
  return null
}

export default Page