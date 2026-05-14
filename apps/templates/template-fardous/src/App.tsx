import { useEffect, useRef, useState } from 'react'
import { useTemplateData, useTemplateFields, LoadingScreen, PasswordGate, PreviewBanner } from '@farhty/template-sdk'
import AdminDashboard from './components/AdminDashboard'
import OrnamentLayer from './components/OrnamentLayer'
import CoverScreen from './components/CoverScreen'
import MainInvitation from './components/MainInvitation'
import { AnimatePresence } from 'framer-motion'

const DEFAULT_AUDIO = 'https://everyayah.com/data/Alafasy_128kbps/030021.mp3'

export default function App() {
  const { instance, isLoading, isAuthenticated } = useTemplateData()
  const { get } = useTemplateFields()
  const isAdminRoute = window.location.pathname === '/admin' || window.location.pathname === '/admin/'

  const [opened, setOpened] = useState(false)
  const [muted, setMuted] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const handleOpen = async () => {
    setOpened(true)
    if (instance?.features?.music !== false) {
      try {
        if (audioRef.current) {
          audioRef.current.volume = 0.55
          await audioRef.current.play()
        }
      } catch { /* autoplay blocked */ }
    }
  }

  const toggleMute = () => {
    if (!audioRef.current) return
    audioRef.current.muted = !audioRef.current.muted
    setMuted(audioRef.current.muted)
  }

  useEffect(() => {
    return () => { audioRef.current?.pause() }
  }, [])

  if (isLoading) return <LoadingScreen bg="#F7F3E9" />

  if (isAdminRoute) {
    if (!isAuthenticated) return <PasswordGate />
    return <AdminDashboard />
  }

  const audioSrc = (get('audio_url') as string) || DEFAULT_AUDIO

  return (
    <div className="relative min-h-[100dvh] overflow-hidden" style={{ background: 'var(--cream)' }}>
      {instance?.isPreview && <PreviewBanner templateName="فردوس" />}

      {instance?.features?.music !== false && (
        <audio ref={audioRef} src={audioSrc} loop preload="auto" />
      )}

      <OrnamentLayer />

      <AnimatePresence mode="wait">
        {!opened ? (
          <CoverScreen key="cover" onOpen={handleOpen} get={get} />
        ) : (
          <MainInvitation key="main" muted={muted} onToggleMute={toggleMute} get={get} instance={instance} />
        )}
      </AnimatePresence>
    </div>
  )
}
