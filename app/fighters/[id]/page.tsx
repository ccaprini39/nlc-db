'use client'

import { useEffect, useState, use } from 'react'
import Pocketbase from 'pocketbase'
import Image from 'next/image'

const pb = new Pocketbase('https://nlc-db.pockethost.io')

export default function FighterPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const [fighter, setFighter] = useState<Fighter | null>(null)
  const [fights, setFights] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchFighter() {
      const fighter = await pb.collection('fighters').getOne(resolvedParams.id, { requestKey: null }) as unknown as Fighter
      const fights = await pb.collection('fights').getFullList({ filter: `redCorner = "${fighter.id}" || blueCorner = "${fighter.id}"`, expand: 'redCorner,blueCorner', requestKey: null })
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
          <div className='flex flex-row gap-4 justify-between'>
            <Image
              src={`https://nlc-db.pockethost.io/api/files/fighters/${fighter?.id}/${fighter?.profilePic}`}
              //src={`/NLC-small-logo.avif`}
              alt={fighter?.name || ''}
              width={500}
              height={500}
              className='rounded-3xl'
            />
            <div className='flex flex-col gap-4'>
              <p className='text-2xl font-bold'>Name: {fighter?.name}</p>
              <p>Height: {fighter?.height}</p>
              <p>Weight: {fighter?.weight}</p>
              {fighter?.dob && <p>Age: {age}</p>}
              {fighter?.dob && <p>DOB: {readableDob}</p>}
              {fighter?.gym && <p>Representing: {fighter?.gym}</p>}
              {fighter?.hometown && <p>Hometown: {fighter?.hometown}</p>}
            </div>
          </div>
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
