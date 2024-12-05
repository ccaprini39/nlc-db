'use client'

import { useEffect, useState } from 'react'
import PocketBase from 'pocketbase'
import Link from 'next/link'
import { CardContent, Card, CardDescription, CardTitle, CardHeader } from '@/app/components/ui/card'
import { Avatar, AvatarImage, AvatarFallback } from '@/app/components/ui/avatar'
import Image from 'next/image'
import { Badge } from '../components/ui/badge'

const pb = new PocketBase('https://nlc-db.pockethost.io')

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
        <div className='flex flex-col gap-4 pt-4 px-4'>
          {events.map((event) => {
            return (
              <EventCard event={event} key={event.id} />
            )
          })}
        </div>
      }
    </div>
  )
}

function EventCard({ event }: { event: Event }) {
  const [fights, setFights] = useState<ExpandedFight[]>([])
  const [loading, setLoading] = useState(true)
  async function fetchEvent() {
    try {
      const fights = await pb.collection('fights').getFullList({
        filter: `event = "${event.id}"`,
        expand: 'redCorner,blueCorner',
        requestKey: null
      }) as unknown as ExpandedFight[]
      setFights(fights)
      setLoading(false)
    } catch (error) {
      console.error(error)
    }
  }
  useEffect(() => {
    fetchEvent()
  }, [])
  const posterUrl = `https://nlc-db.pockethost.io/api/files/events/${event.id}/${event.poster}`
  return (
    <Card className='w-full'>
      <CardHeader>
        <CardTitle>{event.name}</CardTitle>
        <CardDescription>{event.date}</CardDescription>
      </CardHeader>
      <CardContent className='flex justify-center gap-4'>
        <Image src={posterUrl} alt={event.name} width={300} height={400} />
        <div className='flex flex-col gap-4'>
          {loading ? <div>Loading...</div> :
            fights.map((fight) => {
              return (
                <RenderFight fight={fight} key={fight.id} />
              )
            })
          }
        </div>
      </CardContent>
    </Card>
  )
}

function RenderFight({ fight }: { fight: ExpandedFight }) {
  const redCorner = fight.expand.redCorner
  const blueCorner = fight.expand.blueCorner
  const redCornerAvatarUrl = `https://nlc-db.pockethost.io/api/files/fighters/${redCorner.id}/${redCorner.profilePic}`
  const blueCornerAvatarUrl = `https://nlc-db.pockethost.io/api/files/fighters/${blueCorner.id}/${blueCorner.profilePic}`
  const winner = fight.winner
  return (
    <div className='flex flex-col gap-4 w-full outline outline-1 outline-gray-700 rounded-md p-1 bg-gray-900'>
      <div className='flex w-full flex-row gap-4 items-center justify-evenly'>
        <Link href={`/fighters/${redCorner.id}`} className='flex flex-row gap-4 items-center'>
          <Avatar>
            <AvatarImage src={redCornerAvatarUrl} alt={redCorner.name} />
            <AvatarFallback>{redCorner.name}</AvatarFallback>
          </Avatar>
          <p>{redCorner.name} {winner === redCorner.id ? <WinnerBadge /> : null}</p>
        </Link>
        <div className='text-xl opacity-50'>vs</div>
        <Link href={`/fighters/${blueCorner.id}`} className='flex flex-row gap-4 items-center'>
          <p>{blueCorner.name} {winner === blueCorner.id ? <WinnerBadge /> : null}</p>
          <Avatar>
            <AvatarImage src={blueCornerAvatarUrl} alt={blueCorner.name} />
            <AvatarFallback>{blueCorner.name}</AvatarFallback>
          </Avatar>
        </Link>
      </div>
    </div>
  )
  function WinnerBadge() {
    return (
      <Badge className='bg-green-500 hover:bg-green-500'>
        W
      </Badge>
    )
  }
}


