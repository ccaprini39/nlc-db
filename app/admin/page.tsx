'use client'

import { Button } from '@/app/components/ui/button'
import { Input } from '@/app/components/ui/input'
import { Label } from '@/app/components/ui/label'
import { Textarea } from '@/app/components/ui/textarea'
import { Separator } from '@/app/components/ui/separator'
import { useEffect, useState } from 'react'
import { createEvent, createFighter, createFight, getFighters, getEvents } from '@/app/utils'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/app/components/ui/tabs'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/app/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/app/components/ui/popover"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from '@/app/lib/utils'
export default function AdminPage() {
  return (
    <div className='flex-1 p-4 h-full w-full min-h-[100%]'>
      <p>Admin</p>
      <FormTabs />
    </div>
  )
}

function FormTabs() {
  return (
    <Tabs>
      <TabsList>
        <TabsTrigger value='fighter'>Fighter</TabsTrigger>
        <TabsTrigger value='event'>Event</TabsTrigger>
        <TabsTrigger value='fight'>Fight</TabsTrigger>
      </TabsList>
      <TabsContent value='fighter'>
        <AddFighterForm />
      </TabsContent>
      <TabsContent value='event'>
        <AddEventForm />
      </TabsContent>
      <TabsContent value='fight'>
        <AddFightForm />
      </TabsContent>
    </Tabs>
  )
}

function AddFighterForm() {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [ringName, setRingName] = useState('')
  const [dob, setDob] = useState('')
  const [height, setHeight] = useState('')
  const [weight, setWeight] = useState('')
  const [gym, setGym] = useState('')
  const [hometown, setHometown] = useState('')
  const [bio, setBio] = useState('')
  const [name, setName] = useState('')

  function clearForm() {
    setFirstName('')
    setLastName('')
    setRingName('')
    setDob('')
    setHeight('')
    setWeight('')
    setGym('')
    setHometown('')
    setBio('')
    setName('')
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const newFighter = await createFighter({
      firstName,
      lastName,
      ringName,
      dob,
      height,
      weight,
      name,
    })
    if (newFighter) {
      alert('Fighter created: ' + newFighter.name)
      clearForm()
    } else {
      alert('Failed to create fighter')
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className='flex flex-col gap-2'>
          <Label>First Name</Label>
          <Input autoComplete='off' type='text' value={firstName} onChange={(e) => setFirstName(e.target.value)} />
          <Label>Last Name</Label>
          <Input autoComplete='off' type='text' value={lastName} onChange={(e) => setLastName(e.target.value)} />
          <Label>Ring Name</Label>
          <Input autoComplete='off' type='text' value={ringName} onChange={(e) => setRingName(e.target.value)} />
          <Label>Name</Label>
          <Input autoComplete='off' type='text' value={name} onChange={(e) => setName(e.target.value)} />
          <Label>Date of Birth</Label>
          <Input autoComplete='off' type='date' value={dob} onChange={(e) => setDob(e.target.value)} />
          <Label>Height</Label>
          <Input autoComplete='off' type='text' value={height} onChange={(e) => setHeight(e.target.value)} />
          <Label>Weight</Label>
          <Input autoComplete='off' type='text' value={weight} onChange={(e) => setWeight(e.target.value)} />
          <Label>Gym</Label>
          <Input autoComplete='off' type='text' value={gym} onChange={(e) => setGym(e.target.value)} />
          <Label>Hometown</Label>
          <Input autoComplete='off' type='text' value={hometown} onChange={(e) => setHometown(e.target.value)} />
          <Label>Bio</Label>
          <Textarea value={bio} onChange={(e) => setBio(e.target.value)} />
        </div>
        <Button className='w-full' type='submit'>Add Fighter</Button>
      </form>
    </div>
  )
}

function AddEventForm() {
  const [name, setName] = useState('')
  const [date, setDate] = useState('')
  const [poster, setPoster] = useState<File | null>(null)
  const [location, setLocation] = useState('')
  const [venue, setVenue] = useState('')

  function clearForm() {
    setName('')
    setDate('')
    setPoster(null)
    setLocation('')
    setVenue('')
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const newEvent = await createEvent({
      name,
      date,
      location,
      venue,
    })
    if (newEvent) {
      alert('Event created: ' + newEvent.name)
      clearForm()
    } else {
      alert('Failed to create event')
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className='flex flex-col gap-2'>
        <Label>Name</Label>
        <Input autoComplete='off' type='text' value={name} onChange={(e) => setName(e.target.value)} />
        <Label>Date</Label>
        <Input autoComplete='off' type='date' value={date} onChange={(e) => setDate(e.target.value)} />
        {/* <Label>Poster</Label>
        <Input type='file' value={poster} onChange={(e) => setPoster(e.target.files?.[0] || null)} /> */}
        <Label>Location</Label>
        <Input autoComplete='off' type='text' value={location} onChange={(e) => setLocation(e.target.value)} />
        <Label>Venue</Label>
        <Input autoComplete='off' type='text' value={venue} onChange={(e) => setVenue(e.target.value)} />
      </div>
      <Button className='w-full mt-4' type='submit'>Add Event</Button>
    </form>
  )
}

function AddFightForm() {
  const [events, setEvents] = useState<Event[]>([])
  const [fighters, setFighters] = useState<Fighter[]>([])
  const [loading, setLoading] = useState(true)
  const [eventId, setEventId] = useState('')
  const [redCornerId, setRedCornerId] = useState('')
  const [blueCornerId, setBlueCornerId] = useState('')
  const [winnerId, setWinnerId] = useState('')
  const [loserId, setLoserId] = useState('')
  const [youtubeUrl, setYoutubeUrl] = useState('https://www.youtube.com/embed/')
  const [method, setMethod] = useState('')
  const [round, setRound] = useState('')
  const [time, setTime] = useState('')
  const [type, setType] = useState('')
  const [eventComboBoxOpen, setEventComboBoxOpen] = useState(false)
  const [blueCornerComboBoxOpen, setBlueCornerComboBoxOpen] = useState(false)
  const [redCornerComboBoxOpen, setRedCornerComboBoxOpen] = useState(false) 
  const [winnerComboBoxOpen, setWinnerComboBoxOpen] = useState(false) 
  const [loserComboBoxOpen, setLoserComboBoxOpen] = useState(false) 

  useEffect(() => {
    async function getAllFighters() {
      const fetchedFighters = await getFighters()
      setFighters(fetchedFighters)
    }
    async function getAllEvents() {
      const fetchedEvents = await getEvents()
      setEvents(fetchedEvents)
      console.log(fetchedEvents)
      setLoading(false)
    }
    getAllFighters()
    getAllEvents()
  }, [])

  function clearForm() {
    setEventId('')
    setRedCornerId('')
    setBlueCornerId('')
    setYoutubeUrl('')
    setMethod('')
    setRound('')
    setTime('')
    setType('')
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const winner = fighters.find((fighter) => fighter.name === winnerId)
    const loser = fighters.find((fighter) => fighter.name === loserId)
    const redCorner = fighters.find((fighter) => fighter.name === redCornerId)
    const blueCorner = fighters.find((fighter) => fighter.name === blueCornerId)
    const event = events.find((event) => event.name === eventId)
    const newFight = await createFight({
      event: event?.id,
      redCorner: redCorner?.id,
      blueCorner: blueCorner?.id,
      youtubeUrl,
      method,
      winner: winner?.id,
      loser: loser?.id,
      round,
      time,
      type,
    })
    if (newFight) {
      alert('Fight created: ')
      clearForm()
    } else {
      alert('Failed to create fight')
    }
  }

  if (loading) {
    return <div>Loading Fighters and Events...</div>
  }

  return (
    <div className='flex flex-col gap-2'>
      <form onSubmit={handleSubmit}>
        <div className='flex flex-col gap-2'>
          <Label>Event</Label>
          <EventComboBox 
            value={eventId} 
            setValue={setEventId} 
            events={events} 
            open={eventComboBoxOpen}
            setOpen={setEventComboBoxOpen}
          />
          <Label>Red Corner</Label>
          <FighterComboBox 
            value={redCornerId} 
            setValue={setRedCornerId} 
            fighters={fighters} 
            open={redCornerComboBoxOpen}
            setOpen={setRedCornerComboBoxOpen}
          />
          <Label>Blue Corner</Label>
          <FighterComboBox 
            value={blueCornerId} 
            setValue={setBlueCornerId} 
            fighters={fighters} 
            open={blueCornerComboBoxOpen}
            setOpen={setBlueCornerComboBoxOpen}
          />
          <Label>Youtube URL</Label>
          <Input autoComplete='off' type='text' value={youtubeUrl} onChange={(e) => setYoutubeUrl(e.target.value)} />
          <Label>Method</Label>
          <Input autoComplete='off' type='text' value={method} onChange={(e) => setMethod(e.target.value)} />
          <Label>Round</Label>
          <Input autoComplete='off' type='text' value={round} onChange={(e) => setRound(e.target.value)} />
          <Label>Time</Label>
          <Input autoComplete='off' type='text' value={time} onChange={(e) => setTime(e.target.value)} />
          <Label>Type</Label>
          <Input autoComplete='off' type='text' value={type} onChange={(e) => setType(e.target.value)} />
          <Label>Winner</Label>
          <FighterComboBox 
            value={winnerId} 
            setValue={setWinnerId} 
            fighters={fighters} 
            open={winnerComboBoxOpen}
            setOpen={setWinnerComboBoxOpen}
          />
          <Label>Loser</Label>
          <FighterComboBox 
            value={loserId} 
            setValue={setLoserId} 
            fighters={fighters} 
            open={loserComboBoxOpen}
            setOpen={setLoserComboBoxOpen}
          />
        </div>
        <Button className='w-full mt-4' type='submit'>Add Fight</Button>
      </form>
    </div>
  )
}

function EventComboBox({ value, setValue, events, open, setOpen }: { value: string, setValue: (value: string) => void, events: Event[], open: boolean, setOpen: (open: boolean) => void }) {
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value
            ? events.find((event) => event.name === value)?.name
            : "Select Event..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search event..." />
          <CommandList>
            <CommandEmpty>No event found.</CommandEmpty>
            <CommandGroup>
              {events.map((event) => (
                <CommandItem
                  key={event.id}
                  value={event.name}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === event.name ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {event.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

function FighterComboBox({ value, setValue, fighters, open, setOpen }: { value: string, setValue: (value: string) => void, fighters: Fighter[], open: boolean, setOpen: (open: boolean) => void }) {
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value
            ? fighters.find((fighter) => fighter.name === value)?.name
            : "Select Fighter..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search fighter..." />
          <CommandList>
            <CommandEmpty>No fighter found.</CommandEmpty>
            <CommandGroup>
              {fighters.map((fighter) => (
                <CommandItem key={fighter.id} value={fighter.name} onSelect={(currentValue) => {
                  setValue(currentValue === value ? "" : currentValue)
                  setOpen(false)
                }}>
                  {fighter.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  ) 
}

