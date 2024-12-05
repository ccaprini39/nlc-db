'use client'

import { useEffect, useState, use } from 'react'
import Pocketbase from 'pocketbase'

const pb = new Pocketbase('https://nlc-db.pockethost.io')
export default function EventPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const [event, setEvent] = useState<Event | null>(null)
  const [fights, setFights] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  async function fetchEvent() {
    try {
      const event = await pb.collection('events').getOne(resolvedParams.id, { requestKey: null }) as unknown as Event
      const fights = await pb.collection('fights').getFullList({
        filter: `event = "${event.id}"`,
        expand: 'redCorner,blueCorner',
        requestKey: null
      }) as unknown as ExpandedFight[]
      setEvent(event)
      setFights(fights)
    } catch (error) {
      console.error(error)
    }
  }
  useEffect(() => {
    fetchEvent()
  }, [])

  return (
    <div>EventPage</div>
  )
}