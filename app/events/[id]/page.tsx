'use client'

import { useEffect, useState, use } from 'react'

export default function EventPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  useEffect(() => {
    console.log(resolvedParams.id)
  }, [])

  return (
    <div>EventPage</div>
  )
}