'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTemplateFields } from '@farhty/template-sdk'

export default function MusicPlayer() {
  const { get } = useTemplateFields()
  const musicFile = get('music_file') as string | undefined
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    const wasPlaying = sessionStorage.getItem('areej_music_playing')
    if (wasPlaying === 'true' && musicFile && audioRef.current) {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {})
    }
  }, [musicFile])

  if (!musicFile) return null

  const togglePlay = () => {
    if (!audioRef.current) return
    if (isPlaying) {
      audioRef.current.pause()
      sessionStorage.removeItem('areej_music_playing')
    } else {
      audioRef.current.play().then(() => {
        sessionStorage.setItem('areej_music_playing', 'true')
      }).catch(() => {})
    }
    setIsPlaying(!isPlaying)
  }

  return (
    <>
      <audio ref={audioRef} src={musicFile} loop preload="none" />

      <AnimatePresence>
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={togglePlay}
          className="fixed top-6 left-6 z-40 w-12 h-12 rounded-full glass-panel flex items-center justify-center group"
          whileTap={{ scale: 0.9 }}
        >
          <AnimatePresence mode="wait">
            {isPlaying ? (
              <motion.svg
                key="pause"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 100, damping: 20 }}
                width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-rose"
              >
                <rect x="6" y="4" width="4" height="16" rx="1" />
                <rect x="14" y="4" width="4" height="16" rx="1" />
              </motion.svg>
            ) : (
              <motion.svg
                key="play"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 100, damping: 20 }}
                width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-rose"
              >
                <polygon points="5,3 19,12 5,21" />
              </motion.svg>
            )}
          </AnimatePresence>

          {isPlaying && (
            <motion.div
              className="absolute inset-0 rounded-full border border-rose/30"
              animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          )}
        </motion.button>
      </AnimatePresence>
    </>
  )
}