import { useState, useEffect } from 'react'
import { apiClient } from '../api/client'

export interface Testimonial {
  _id: string
  name: string
  location: string
  text: string
  rating: number
  avatar: string
}

export function useTestimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    apiClient.get<Testimonial[]>('/api/testimonials')
      .then(r => setTestimonials(r.data))
      .catch(() => setTestimonials([]))
      .finally(() => setLoading(false))
  }, [])

  return { testimonials, loading }
}
