import { useState, useEffect } from 'react'
import { apiClient } from '../api/client'

export interface Promo {
  _id: string
  type: 'banner' | 'popup'
  title: string
  subtitle?: string
  badge?: string
  ctaLabel: string
  ctaLink?: string
  imageUrl?: string
  theme: 'purple' | 'gold' | 'rose' | 'dark'
  isActive: boolean
  order: number
  expiresAt?: string
}

export function usePromos() {
  const [promos, setPromos] = useState<Promo[]>([])

  useEffect(() => {
    apiClient.get<Promo[]>('/api/promos').then(r => setPromos(r.data)).catch(() => {})
  }, [])

  const banners = promos.filter(p => p.type === 'banner')
  const popup = promos.find(p => p.type === 'popup') ?? null

  return { banners, popup }
}
