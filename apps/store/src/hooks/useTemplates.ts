import { useState, useEffect } from 'react'
import { apiClient } from '../api/client'

export interface TemplateFeatures {
  music: boolean
  gallery: boolean
  rsvp: boolean
  countdownTimer: boolean
  rtl: boolean
  pages: number
}

export interface Template {
  _id: string
  name: string
  slug: string
  price: number
  description: string
  language: 'ar' | 'en' | 'both'
  features: TemplateFeatures
  previewImages: string[]
  previewVideo?: string
  status: 'draft' | 'active'
}

export function useTemplates() {
  const [templates, setTemplates] = useState<Template[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    apiClient.get<Template[]>('/api/templates')
      .then(r => setTemplates(r.data))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  return { templates, loading, error }
}
