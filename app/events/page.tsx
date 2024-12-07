'use client'

import { useEffect, useState } from 'react'
import PocketBase from 'pocketbase'
import Link from 'next/link'
import { CardContent, Card, CardDescription, CardTitle, CardHeader } from '@/app/components/ui/card'
import Image from 'next/image'
import { Badge } from '@/app/components/ui/badge'
import { ScrollArea } from '@/app/components/ui/scroll-area'
import { DialogTrigger } from '@/app/components/ui/dialog'
import { Dialog, DialogTitle, DialogContent, DialogHeader } from '@/app/components/ui/dialog'
import { BsYoutube } from 'react-icons/bs'
import { Button } from '@/app/components/ui/button'
import { Table, TableHead, TableBody, TableRow, TableCell } from '@/app/components/ui/table'

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
    <Card className='w-full lg:h-[600px] h-[800px]'>
      <CardHeader>
        <CardTitle className='text-2xl'>{event.name}</CardTitle>
        <CardDescription>{event.date}</CardDescription>
      </CardHeader>
      <CardContent className='flex lg:flex-row flex-col gap-4'>
        <Image
          className='lg:w-1/3 w-full object-contain max-h-[400px]'
          src={posterUrl}
          alt={event.name}
          width={400}
          height={500}
        />
        <ScrollArea className='lg:w-2/3 lg:h-[400px] w-full h-[250px]'>
          <div className='text-2xl opacity-70 mb-4'>Fight Card</div>
          {loading ? <div>Loading Fight Card...</div> :
            <Table>
              <TableBody>
                {fights.map((fight) => {
                  return (
                    <RenderFight fight={fight} key={fight.id} />
                  )
                })}
              </TableBody>
            </Table>}
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
  const youtubeUrl = fight.youtubeUrl //TODO: add the youtube dialog
  return (
    <TableRow>
      <TableCell>
        <Link href={`/fighters/${redCorner.id}`}>
          <div>{redCorner.name} {winner === redCorner.id ? <WinnerBadge /> : null}</div>
        </Link>
      </TableCell>
      <TableCell>
        <div className='text-xl opacity-50'>vs</div>
      </TableCell>
      <TableCell className='text-right'>
        <Link href={`/fighters/${blueCorner.id}`}>
          <div>{winner === blueCorner.id ? <WinnerBadge /> : null} {blueCorner.name}</div>
        </Link>
      </TableCell>
      <TableCell>
        <YoutubeEmbedDialog url={youtubeUrl} />
      </TableCell>
    </TableRow>
  )
  return (
    <div className='flex flex-col gap-4 w-full outline outline-1 outline-gray-700 rounded-md p-1 bg-gray-900'>
      <div className='flex w-full flex-row items-center justify-around'>
        <Link href={`/fighters/${redCorner.id}`}>
          <div>{redCorner.name} {winner === redCorner.id ? <WinnerBadge /> : null}</div>
        </Link>
        <div className='text-xl opacity-50'>vs</div>
        <Link href={`/fighters/${blueCorner.id}`}>
          <div>{winner === blueCorner.id ? <WinnerBadge /> : null} {blueCorner.name}</div>
        </Link>
        <div className='flex'>
          <YoutubeEmbedDialog url={youtubeUrl} />
        </div>
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

function YoutubeEmbedDialog({ url }: { url: string }) {
  if (!url || url === '') return <div className='text-red-500'></div>
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant='ghost'>
          <BsYoutube />
        </Button>
      </DialogTrigger>
      <DialogContent >
        <DialogHeader>
          <DialogTitle>Watch Fight</DialogTitle>
        </DialogHeader>
        <div className='w-full h-full min-h-[600px]'>
          <iframe
            src={url}
            className='w-full h-full'
            title='Youtube Embed'
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}


