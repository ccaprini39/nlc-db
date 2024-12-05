'use client'

import { useEffect } from 'react'

export default function EventPage({ params }: { params: { id: string } }) {
  useEffect(() => {
    console.log(params.id)
  }, [])

  return (
    <div>EventPage</div>
  )
}