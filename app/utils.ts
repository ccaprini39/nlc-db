'use client'

import { useEffect } from 'react'

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
