'use client'

import { useEffect, useState, use } from 'react'
import Pocketbase from 'pocketbase'
import Image from 'next/image'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/app/components/ui/dialog'
import { BsYoutube } from "react-icons/bs";
import { Button } from '@/app/components/ui/button'
import Link from 'next/link'
import { Separator } from '@/app/components/ui/separator'
import { ScrollArea } from '@/app/components/ui/scroll-area'
const pb = new Pocketbase('https://nlc-db.pockethost.io')

export default function FighterPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const [fighter, setFighter] = useState<Fighter | null>(null)
  const [fights, setFights] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchFighter() {
      const fighter = await pb.collection('fighters').getOne(resolvedParams.id, { requestKey: null }) as unknown as Fighter
      const fights = await pb.collection('fights').getFullList(
        {
          filter: `redCorner = "${fighter.id}" || blueCorner = "${fighter.id}"`,
          expand: 'redCorner,blueCorner,event',
          sort: '-event.date',
          requestKey: null
        }
      )
      setFighter(fighter)
      setFights(fights)
      setLoading(false)
    }
    fetchFighter()
  }, [resolvedParams.id])

  const age = new Date().getFullYear() - new Date(fighter?.dob || '').getFullYear()
  const readableDob = new Date(fighter?.dob || '').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })

  const profilePicUrl = fighter?.mainPic ?
    `https://nlc-db.pockethost.io/api/files/fighters/${fighter?.id}/${fighter?.mainPic}`
    :
    'https://nlc-db.pockethost.io/api/files/images/sr7yugn0nuk4td9/generic_cBSufze9Du.avif'



  return (
    <div className='flex-1 p-4 h-full w-full min-h-[100%]'>
      {loading ? <p className='h-full w-full flex items-center justify-center'>Loading...</p> :
        <div className='flex flex-col gap-4 h-full'>
          <div className='flex flex-row gap-4 justify-center h-[50vh] w-full'>
            <Image
              src={profilePicUrl}
              //src={`/NLC-small-logo.avif`}
              alt={fighter?.name || ''}
              height={500}
              width={900}
              quality={100}
              className='rounded-3xl'
              onError={(e) => {
                e.currentTarget.src = '/NLC-small-logo.avif'
              }}
            />
            <div className='flex flex-col gap-1'>
              <p className='text-2xl font-bold'>{fighter?.name}</p>
              <p><span className='opacity-70'>Height:</span> {fighter?.height}</p>
              <p><span className='opacity-70'>Weight:</span> {fighter?.weight}</p>
              {fighter?.dob && <p><span className='opacity-70'>Age:</span> {age}</p>}
              {fighter?.dob && <p><span className='opacity-70'>DOB:</span> {readableDob}</p>}
              {fighter?.gym && <p><span className='opacity-70'>Representing:</span> {fighter?.gym}</p>}
              {fighter?.hometown && <p><span className='opacity-70'>Hometown:</span> {fighter?.hometown}</p>}
              {fighter?.bio && <div className='min-h-[300px] overflow-y-auto' dangerouslySetInnerHTML={{ __html: fighter?.bio }} />}
            </div>
          </div>
          <Separator />
          <NlcRecord fights={fights} fighterId={fighter?.id || ''} />
          {/* <div className='flex flex-col gap-4'>
            {fights.length > 0 && <p>Fights</p>}
            {fights.map((fight: Fight, index: number) => (
              <iframe src={`${fight?.youtubeUrl}`}
                key={index}
                className='w-full h-full min-h-[400px]'
                title={`${fight.redCorner} vs ${fight.blueCorner}`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            ))}
          </div> */}
        </div>
      }
    </div>
  )
}

//this will be a table with the fighters record, very similar to wiki or tapology
function NlcRecord({ fights, fighterId }: { fights: ExpandedFight[], fighterId: string }) {

  return (
    <div className='flex-1'>
      <p className='text-2xl font-bold'>NLC Fight Record</p>
      <Table>
        <TableHeader>
          <TableRow className='hover:bg-transparent'>
            <TableHead>Result</TableHead>
            <TableHead></TableHead>
            <TableHead>Opponent</TableHead>
            <TableHead>Event</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Method</TableHead>
            <TableHead>Watch</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {fights.map((fight: ExpandedFight, index: number) => (
            <FightTableRow fight={fight} key={index} />
          ))}
        </TableBody>
      </Table>
    </div>
  )

  function FightTableRow({ fight }: { fight: ExpandedFight }) {
    const opponent = fight.redCorner === fighterId ? fight.expand.blueCorner.name : fight.expand.redCorner.name
    const opponentId = fight.redCorner === fighterId ? fight.expand.blueCorner.id : fight.expand.redCorner.id
    const event = fight.expand.event.name
    const eventId = fight.expand.event.id
    const date = fight.expand.event.date
    //if the fight is a draw or a no contest, then the winner and loser are null
    //check if the method is a draw or no contest
    const method = fight.method === 'Draw' || fight.method === 'No Contest' ? 'No Contest' : fight.method
    let result = fight.winner === fighterId ? 'Win' : fight.loser === fighterId ? 'Loss' : 'Draw'
    //if the method is a draw or no contest, then the result is the method
    if (method === 'Draw' || method === 'No Contest') result = method
    const time = fight.time
    const backgroundColor = fight.winner === fighterId ? 'bg-green-800 hover:bg-green-600' : fight.loser === fighterId ? 'bg-red-800 hover:bg-red-600' : 'bg-gray-800 hover:bg-gray-600'
    const fightOutcome = `${method}, (${time}) R${fight.round}`
    return (
      <TableRow className={backgroundColor}>
        <TableCell>{result}</TableCell>
        <TableCell>{fight.type}</TableCell>
        <TableCell>
          <Link href={`/fighters/${opponentId}`}>{opponent}</Link>
        </TableCell>
        <TableCell>
          <Link href={`/events/${eventId}`}>{event}</Link>
        </TableCell>
        <TableCell>{formatDate(date)}</TableCell>
        <TableCell>{fightOutcome}</TableCell>
        <TableCell>
          <YoutubeEmbedDialog url={fight.youtubeUrl || ''} />
        </TableCell>
      </TableRow>
    )
  }
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
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


//this is a sample of what the expanded fight object looks like
const sampleExpandedFight = {
  "blueCorner": "r9eqz1ko41wenna",
  "collectionId": "dica8eekk2un84w",
  "collectionName": "fights",
  "created": "2024-12-04 21:57:38.962Z",
  "date": "2024-12-09 07:00:00.000Z",
  "event": "p12yjape2ixppgv",
  "expand": {
    "blueCorner": {
      "bio": "",
      "collectionId": "fmsebno4k7gapcq",
      "collectionName": "fighters",
      "created": "2024-12-04 21:49:47.066Z",
      "dob": "1992-06-07 12:00:00.000Z",
      "firstName": "Travis",
      "gym": "Madison Martial Arts",
      "height": "5'9\" (175cm)",
      "hometown": "",
      "id": "r9eqz1ko41wenna",
      "lastName": "Bender",
      "name": "Travis Bender",
      "profilePic": "bender_no_bg_VVZ6iXC0pM.png",
      "ringName": "",
      "updated": "2024-12-04 23:15:42.295Z",
      "weight": "170"
    },
    "event": {
      "collectionId": "swpffxmjty6u601",
      "collectionName": "events",
      "created": "2024-12-04 21:41:23.090Z",
      "date": "2024-03-09 12:00:00.000Z",
      "id": "p12yjape2ixppgv",
      "location": "Williamson, WV",
      "name": "NLC 1: The Beginning",
      "updated": "2024-12-04 21:43:40.533Z",
      "venue": "Williamson Field House"
    },
    "redCorner": {
      "bio": "",
      "collectionId": "fmsebno4k7gapcq",
      "collectionName": "fighters",
      "created": "2024-12-04 21:52:45.232Z",
      "dob": "1995-08-01 12:00:00.000Z",
      "firstName": "Ronnie",
      "gym": "",
      "height": "",
      "hometown": "",
      "id": "nxt5x9jfq9n2iqz",
      "lastName": "White",
      "name": "Ronnie White",
      "profilePic": "benderxwhite_TY4wriuaCo.jpg",
      "ringName": "",
      "updated": "2024-12-04 22:47:38.619Z",
      "weight": ""
    }
  },
  "id": "j1at6bdzqsg9zjk",
  "loser": "nxt5x9jfq9n2iqz",
  "method": "Submission (Guillotine)",
  "redCorner": "nxt5x9jfq9n2iqz",
  "round": "1",
  "time": "0:26",
  "updated": "2024-12-04 22:29:41.847Z",
  "winner": "r9eqz1ko41wenna",
  "youtubeUrl": "https://www.youtube.com/embed/i3YlHYXSAf8?si=S0Rp0eDkgBiN2TOX"
}
