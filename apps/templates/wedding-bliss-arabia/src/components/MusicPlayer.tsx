import { useRef, useState } from 'react'
import { useTemplateFields } from '@farhty/template-sdk'
import { motion } from 'framer-motion'
import { Volume2, VolumeX } from 'lucide-react'

export default function MusicPlayer() {
  const { get } = useTemplateFields()
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [playing, setPlaying] = useState(false)

  const musicFile = get('music_file') ?? ''

  if (!musicFile) return null

  const toggle = async () => {
    if (!audioRef.current) return
    if (playing) {
      audioRef.current.pause()
      setPlaying(false)
    } else {
      try {
        audioRef.current.volume = 0.35
        await audioRef.current.play()
        setPlaying(true)
      } catch {
        setPlaying(false)
      }
    }
  }

  return (
    <>
      <audio ref={audioRef} src={musicFile} loop preload="none" />
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.2 }}
        onClick={toggle}
        aria-label={playing ? 'Mute' : 'Play music'}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full border border-gold/40 backdrop-blur-md transition-all hover:scale-110"
        style={{
          background: 'oklch(0.18 0.05 155 / 0.85)',
          boxShadow: 'var(--shadow-gold)',
        }}
      >
        {playing ? (
          <Volume2 className="h-5 w-5 text-gold" />
        ) : (
          <VolumeX className="h-5 w-5 text-gold" />
        )}
        {playing && (
          <span className="absolute inset-0 rounded-full border border-gold/60 animate-ping-slow" />
        )}
      </motion.button>
    </>
  )
}
