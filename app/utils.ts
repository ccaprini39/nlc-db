'use client'

import { useEffect } from 'react'
import Pocketbase from 'pocketbase'

export function useScrollToTop() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])
}

export function useScrollToBottom() {
  useEffect(() => {
    window.scrollTo(0, document.body.scrollHeight)
  }, [])
}

export function useScrollToElement(element: HTMLElement) {
  useEffect(() => {
    element.scrollIntoView({ behavior: 'smooth' })
  }, [])
}

export function useScrollToElementById(id: string) {
  useScrollToElement(document.getElementById(id) as HTMLElement)
}

const pb = new Pocketbase('https://nlc-db.pockethost.io')
export async function getFighters(): Promise<Fighter[]> {
  try {
    const fighters = await pb.collection('fighters').getFullList({ perPage: 500, sort: '-created', requestKey: null }) as unknown as Fighter[]
    return fighters
  } catch (error) {
    console.error(error)
    return []
  }
}

export async function getEvents(): Promise<Event[]> {
  try {
    const events = await pb.collection('events').getFullList({ perPage: 500, sort: '-created', requestKey: null }) as unknown as Event[]
    return events
  } catch (error) {
    console.error(error)
    return []
  }
}

//create a fighter
//takes in a partial fighter object, only needs name
export async function createFighter(fighter: Partial<Fighter>): Promise<Fighter | undefined> {
  try {
    const newFighter = await pb.collection('fighters').create(fighter) as unknown as Fighter
    return newFighter
  } catch (error) {
    console.error(error)
    return undefined
  }
}

export async function createEvent(event: Partial<Event>): Promise<Event | undefined> {
  try {
    const newEvent = await pb.collection('events').create(event) as unknown as Event
    return newEvent
  } catch (error) {
    console.error(error)
    return undefined
  }
}

export async function createFight(fight: Partial<Fight>): Promise<Fight | undefined> {
  try {
    const newFight = await pb.collection('fights').create(fight) as unknown as Fight
    return newFight
  } catch (error) {
    console.error(error)
    return undefined
  }
}