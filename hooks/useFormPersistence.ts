'use client'

import { useState, useEffect, useCallback } from 'react'
import { ContactInfo, Idea } from '@/lib/types'

const STORAGE_KEY = 'alignment-survey-draft'

interface StoredData {
  contactInfo: ContactInfo
  ideas: Idea[]
  lastUpdated: string
}

interface UseFormPersistenceReturn {
  contactInfo: ContactInfo
  ideas: Idea[]
  setContactInfo: (info: ContactInfo) => void
  addIdea: (idea: Idea) => void
  updateIdea: (id: string, idea: Idea) => void
  deleteIdea: (id: string) => void
  clearAll: () => void
  hasUnsavedData: boolean
  isInitialized: boolean
}

const defaultContactInfo: ContactInfo = {
  email: '',
  name: '',
  institution: '',
  collaborationInterest: 'interested_in_collaboration',
  collaborationOther: '',
}

export function useFormPersistence(): UseFormPersistenceReturn {
  const [contactInfo, setContactInfoState] = useState<ContactInfo>(defaultContactInfo)
  const [ideas, setIdeas] = useState<Idea[]>([])
  const [isInitialized, setIsInitialized] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed: StoredData = JSON.parse(stored)
        setContactInfoState(parsed.contactInfo || defaultContactInfo)
        setIdeas(parsed.ideas || [])
      }
    } catch (error) {
      console.error('Failed to load saved data:', error)
    }
    setIsInitialized(true)
  }, [])

  // Save to localStorage whenever data changes
  useEffect(() => {
    if (!isInitialized) return

    try {
      const data: StoredData = {
        contactInfo,
        ideas,
        lastUpdated: new Date().toISOString(),
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    } catch (error) {
      console.error('Failed to save data:', error)
    }
  }, [contactInfo, ideas, isInitialized])

  const setContactInfo = useCallback((info: ContactInfo) => {
    setContactInfoState(info)
  }, [])

  const addIdea = useCallback((idea: Idea) => {
    setIdeas((prev) => [...prev, idea])
  }, [])

  const updateIdea = useCallback((id: string, idea: Idea) => {
    setIdeas((prev) => prev.map((i) => (i.id === id ? idea : i)))
  }, [])

  const deleteIdea = useCallback((id: string) => {
    setIdeas((prev) => prev.filter((i) => i.id !== id))
  }, [])

  const clearAll = useCallback(() => {
    setContactInfoState(defaultContactInfo)
    setIdeas([])
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch (error) {
      console.error('Failed to clear saved data:', error)
    }
  }, [])

  const hasUnsavedData =
    ideas.length > 0 ||
    contactInfo.email !== '' ||
    contactInfo.name !== ''

  return {
    contactInfo,
    ideas,
    setContactInfo,
    addIdea,
    updateIdea,
    deleteIdea,
    clearAll,
    hasUnsavedData,
    isInitialized,
  }
}
