import { useState } from 'react'
import { api } from '../services/api'
import { TemplateContext } from './useTemplateData.tsx'
import { useContext } from 'react'
import { InstanceData } from '../types'

export function useInstanceAuth() {
  const { slug, setInstance, setFieldData } = useContext(TemplateContext)
  const [isAuthenticating, setIsAuthenticating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const authenticate = async (password: string): Promise<boolean> => {
    setIsAuthenticating(true)
    setError(null)
    try {
      const res = await api.post<{ token: string }>('/api/instances/auth', { slug, password })
      const token = res.data.token
      localStorage.setItem(`farhty_token_${slug}`, token)

      // Now fetch instance data — pass slug as query param
      const dataRes = await api.get<InstanceData>('/api/instances/by-domain', {
        params: { slug },
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = dataRes.data
      setInstance(data)

      // Merge field defaults
      const merged: Record<string, unknown> = {}
      for (const field of data.fields) {
        merged[field.key] = data.data[field.key] ?? field.defaultValue ?? ''
      }
      setFieldData(merged)

      return true
    } catch {
      setError('كلمة المرور غير صحيحة. حاول مرة أخرى.')
      return false
    } finally {
      setIsAuthenticating(false)
    }
  }

  return { authenticate, isAuthenticating, error }
}
