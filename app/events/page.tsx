'use client'

import { useEffect, useState } from 'react'
import PocketBase from 'pocketbase'
import Link from 'next/link'
import { CardContent, Card, CardDescription, CardTitle, CardHeader } from '@/app/components/ui/card'
import { Avatar, AvatarImage, AvatarFallback } from '@/app/components/ui/avatar'
import Image from 'next/image'
import { Badge } from '../components/ui/badge'
import { ScrollArea } from '../components/ui/scroll-area'

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
  const posterUrl = event.poster ?
    `https://nlc-db.pockethost.io/api/files/events/${event.id}/${event.poster}`
    :
    'https://nlc-db.pockethost.io/api/files/images/2xvlpftcdqxg76t/new_line_cagefighting_logo_OJDqq6P5hM.png'
  return (
    <Card className='w-full'>
      <CardHeader>
        <CardTitle className='text-2xl'>{event.name}</CardTitle>
        <CardDescription>{event.date}</CardDescription>
      </CardHeader>
      <CardContent className='flex justify-center gap-4 h-[500px]'>
        <Image 
          src={posterUrl} 
          alt={event.name} 
          width={400} 
          height={500} 
        />
        <ScrollArea className='flex flex-col gap-4 max-h-[500px]'>
          <div className='text-xl w-full text-center'>Fight Card</div>
          {loading ? <div>Loading...</div> :
            fights.map((fight) => {
              return (
                <RenderFight fight={fight} key={fight.id} />
              )
            })
          }
        </ScrollArea>
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
      <div className='flex w-full flex-row gap-4 items-center justify-between'>
        <Link href={`/fighters/${redCorner.id}`} className='flex flex-row gap-4 items-center'>
          <Avatar>
            <AvatarImage src={redCornerAvatarUrl} alt={redCorner.name} />
            <AvatarFallback>{redCorner.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>{redCorner.name} {winner === redCorner.id ? <WinnerBadge /> : null}</div>
        </Link>
        <div className='text-xl opacity-50'>vs</div>
        <Link href={`/fighters/${blueCorner.id}`} className='flex flex-row gap-4 items-center'>
          <div>{blueCorner.name} {winner === blueCorner.id ? <WinnerBadge /> : null}</div>
          <Avatar>
            <AvatarImage src={blueCornerAvatarUrl} alt={blueCorner.name} />
            <AvatarFallback>{blueCorner.name.charAt(0)}</AvatarFallback>
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


