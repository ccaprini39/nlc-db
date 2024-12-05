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


  return (
    <div className='p-4 h-full w-full bg-[url("/nlc-background.jpg")] bg-cover bg-center bg-no-repeat'>
      {loading ? <p className='h-full w-full flex items-center justify-center'>Loading...</p> :
        <>
          <div className='flex flex-row gap-4 justify-center'>
            <Image
              src={`https://nlc-db.pockethost.io/api/files/fighters/${fighter?.id}/${fighter?.profilePic}`}
              //src={`/NLC-small-logo.avif`}
              alt={fighter?.name || ''}
              width={500}
              height={500}
              className='rounded-3xl'
            />
            <div className='flex flex-col gap-4'>
              <p className='text-2xl font-bold'>{fighter?.name}</p>
              <p>Height: {fighter?.height}</p>
              <p>Weight: {fighter?.weight}</p>
              {fighter?.dob && <p>Age: {age}</p>}
              {fighter?.dob && <p>DOB: {readableDob}</p>}
              {fighter?.gym && <p>Representing: {fighter?.gym}</p>}
              {fighter?.hometown && <p>Hometown: {fighter?.hometown}</p>}
            </div>
          </div>
          <NlcRecord fights={fights} fighterId={fighter?.id || ''} />
          <div className='flex flex-col gap-4'>
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
          </div>
        </>
      }
    </div>
  )
}

//this will be a table with the fighters record, very similar to wiki or tapology
function NlcRecord({ fights, fighterId }: { fights: ExpandedFight[], fighterId: string }) {

  return (
    <Table>
      <TableHeader>
        <TableRow className='hover:bg-transparent'>
          <TableHead>Result</TableHead>
          <TableHead>Opponent</TableHead>
          <TableHead>Event</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Method</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {fights.map((fight: ExpandedFight, index: number) => (
          <FightTableRow fight={fight} key={index} />
        ))}
      </TableBody>
    </Table>
  )

  function FightTableRow({ fight }: { fight: ExpandedFight }) {
    const opponent = fight.redCorner === fighterId ? fight.expand.blueCorner.name : fight.expand.redCorner.name
    const event = fight.expand.event.name
    const date = fight.expand.event.date
    const result = fight.winner === fighterId ? 'Win' : 'Loss'
    const method = fight.method
    const time = fight.time
    const backgroundColor = fight.winner === fighterId ? 'bg-green-800 hover:bg-green-600' : 'bg-red-800 hover:bg-red-600'
    const fightOutcome = `${method}, (${time}) R${fight.round}`
    return (
      <TableRow className={backgroundColor}>
        <TableCell>{result}</TableCell>
        <TableCell>{opponent}</TableCell>
        <TableCell>{event}</TableCell>
        <TableCell>{formatDate(date)}</TableCell>
        <TableCell>{fightOutcome}</TableCell>
      </TableRow>
    )
  }
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

function YoutubeEmbedDialog({ url }: { url: string }) {
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
        <div className='w-full h-full'>
          <iframe src={url} className='w-full h-full' title='Youtube Embed' frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen />
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
