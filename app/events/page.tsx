'use client'

import { useEffect, useState } from 'react'
import PocketBase from 'pocketbase'
import Link from 'next/link'

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)

  async function fetchEvents() {
    const pb = new PocketBase('https://nlc-db.pockethost.io')
    const events = await pb.collection('events').getFullList({
      sort: '-date'
    }) as unknown as Event[]
    setEvents(events)
    setLoading(false)
  }

  useEffect(() => {
    console.log('EventsPage')
    fetchEvents()
  }, [])

  return (
    <div>
      {loading ? <div>Loading...</div> :
        <div className='flex flex-col gap-4'>
          {events.map((event) => {
            return (
              <Link href={`/events/${event.id}`} key={event.id}>
                {event.name}
              </Link>
            )
          })}
        </div>
      }
    </div>

  )
}