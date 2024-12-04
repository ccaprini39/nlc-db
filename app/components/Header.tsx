'use client'
import Link from 'next/link'
import { Input } from "@/app/components/ui/input"
import { Search } from 'lucide-react'
import Image from 'next/image'
import Pocketbase from 'pocketbase'
import { useEffect, useState } from 'react'

export default function Header() {

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex flex-row h-14 items-center justify-between w-full">
        <div className="mr-4 flex gap-4 flex-1 items-center ">
          <Link href="/" className="transition-colors hover:text-foreground/80 text-foreground/60">
            <Image
              src="/nlc-small-logo.avif"
              alt="Home"
              width={100}
              height={100}
            />
            <span className="sr-only">Home</span>
          </Link>
          <Link href="/events" className="transition-colors hover:text-foreground/80 text-foreground/60">
            Events
            <span className="sr-only">Events</span>
          </Link>
          <Link href="/fighters" className="transition-colors hover:text-foreground/80 text-foreground/60">
            Fighters
            <span className="sr-only">Fighters</span>
          </Link>
        </div>
        <nav className="flex items-center space-x-4 md:space-x-6 text-sm font-medium">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <form className="relative">
              <SearchBar />
            </form>
          </div>
        </nav>
      </div>
    </header>
  )
}

const pb = new Pocketbase('https://nlc-db.pockethost.io')

async function searchDb(query: string) {
  try {
    const data = await pb.collection('fighters').getFullList({
      filter: `name ~ "${query}"`,
      requestKey: null
    })
    return data
  } catch (error) {
    console.error(error)
    return []
  }
}

function SearchBar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);

  useEffect(() => {
    async function search() {
      if (searchQuery && searchQuery.length > 2) {
        const results = await searchDb(searchQuery);
        setResults(results);
      } else if (searchQuery.length < 3) {
        setResults([]);
      }
    }
    search();
  }, [searchQuery]);

  return (
    <div className='relative'>
      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Search fighters here..."
        className="pl-8 md:w-[300px] lg:w-[400px]"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      {results.length > 0 &&
        <div className='absolute top-10 left-0 flex flex-col gap-2 bg-zinc-700 rounded-md p-2 z-[999] w-full'>
          {results.map((result) => (
            <Link key={result.id} href={`/fighters/${result.id}`} onClick={() => {
              setSearchQuery('');
            }}>{result.name}</Link>
          ))}
        </div>}
    </div>
  )
}
