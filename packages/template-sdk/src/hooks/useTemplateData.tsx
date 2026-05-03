import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { InstanceData } from '../types'
import { loadConfig, setApiBase, api } from '../services/api'

// ─── Context ──────────────────────────────────────────────────────────────────

interface TemplateContextValue {
  instance: InstanceData | null
  isLoading: boolean
  isAuthenticated: boolean
  slug: string
  setInstance: (d: InstanceData) => void
  fieldData: Record<string, unknown>
  setFieldData: React.Dispatch<React.SetStateAction<Record<string, unknown>>>
}

export const TemplateContext = createContext<TemplateContextValue>({
  instance: null,
  isLoading: true,
  isAuthenticated: false,
  slug: '',
  setInstance: () => {},
  fieldData: {},
  setFieldData: () => {},
})

// ─── Provider ─────────────────────────────────────────────────────────────────

export function TemplateProvider({ children }: { children: ReactNode }) {
  const [instance, setInstance] = useState<InstanceData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [slug, setSlug] = useState('')
  const [fieldData, setFieldData] = useState<Record<string, unknown>>({})

  useEffect(() => {
    const startTime = Date.now()

    const bootstrap = async () => {
      // 1. Load config.json and resolve slug from hostname
      const cfg = await loadConfig()
      setApiBase(cfg.apiBase)

      const hostname = window.location.hostname  // e.g. ahmed-sara.farhty.online
      const resolvedSlug = cfg.slug || hostname.split('.')[0]
      setSlug(resolvedSlug)

      // 2. Check for stored token
      const tokenKey = `farhty_token_${resolvedSlug}`
      const token = localStorage.getItem(tokenKey)

      // 3. Fetch instance data (always, even without token — public read)
      try {
        const headers: Record<string, string> = {}
        if (token) {
          headers.Authorization = `Bearer ${token}`
        }
        const res = await api.get<InstanceData>('/api/instances/by-domain', {
          params: { slug: resolvedSlug },
          headers,
        })
        const data = res.data
        setInstance(data)
        const merged: Record<string, unknown> = {}
        for (const field of data.fields) {
          merged[field.key] = data.data[field.key] ?? field.defaultValue ?? ''
        }
        setFieldData(merged)
        if (token) {
          setIsAuthenticated(true)
        }
      } catch {
        if (token) {
          localStorage.removeItem(tokenKey)
        }
      } finally {
        await minDelay(startTime)
        setIsLoading(false)
      }
    }

    bootstrap()
  }, [])

  return (
    <TemplateContext.Provider value={{ instance, isLoading, isAuthenticated, slug, setInstance, fieldData, setFieldData }}>
      {children}
    </TemplateContext.Provider>
  )
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useTemplateData() {
  return useContext(TemplateContext)
}

// Ensures minimum 800ms display for the loading screen
function minDelay(startTime: number): Promise<void> {
  const elapsed = Date.now() - startTime
  const remaining = Math.max(0, 800 - elapsed)
  return new Promise(r => setTimeout(r, remaining))
}
