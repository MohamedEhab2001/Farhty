import { useEffect, useState, useRef, useCallback } from 'react'
import { useTemplateData } from '@farhty/template-sdk'

interface MusicPlayerProps {
  src: string
  autoPlayTrigger?: () => void
}

export default function MusicPlayer({ src }: MusicPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [playing, setPlaying] = useState(false)
  const [showButton, setShowButton] = useState(false)

  useEffect(() => {
    if (!src) {
      setShowButton(false)
      return
    }
    const audio = new Audio(src)
    audio.loop = true
    audio.volume = 0.4
    audioRef.current = audio

    const tryPlay = async () => {
      try {
        await audio.play()
        setPlaying(true)
      } catch {
        // autoplay blocked
      }
      setShowButton(true)
    }

    const handleInteraction = () => {
      if (!playing && audioRef.current) {
        audioRef.current.play().then(() => setPlaying(true)).catch(() => {})
      }
    }

    tryPlay()

    document.addEventListener('click', handleInteraction, { once: true })
    document.addEventListener('touchstart', handleInteraction, { once: true })

    return () => {
      audio.pause()
      audio.src = ''
      document.removeEventListener('click', handleInteraction)
      document.removeEventListener('touchstart', handleInteraction)
    }
  }, [src])

  const toggle = useCallback(() => {
    if (!audioRef.current) return
    if (playing) {
      audioRef.current.pause()
      setPlaying(false)
    } else {
      audioRef.current.play().then(() => setPlaying(true)).catch(() => {})
    }
  }, [playing])

  if (!showButton || !src) return null

  return (
    <>
      <style>{`
        @keyframes warda-wave1 { 0%,100%{height:12px} 50%{height:6px} }
        @keyframes warda-wave2 { 0%,100%{height:16px} 50%{height:8px} }
        @keyframes warda-wave3 { 0%,100%{height:12px} 50%{height:6px} }
        .warda-wave1 { animation: warda-wave1 0.8s ease-in-out infinite; }
        .warda-wave2 { animation: warda-wave2 0.8s ease-in-out infinite 0.15s; }
        .warda-wave3 { animation: warda-wave3 0.8s ease-in-out infinite 0.3s; }
      `}</style>
      <button
        onClick={toggle}
        className="fixed bottom-6 left-6 z-40 w-12 h-12 rounded-full bg-white/80 backdrop-blur-sm border border-blush-300 shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-xl"
        title={playing ? 'إيقاف الموسيقى' : 'تشغيل الموسيقى'}
      >
        {playing ? (
          <div className="flex items-center gap-[2px]">
            <span className="warda-wave1 w-[3px] h-3 bg-blush-500 rounded-full" />
            <span className="warda-wave2 w-[3px] h-4 bg-blush-400 rounded-full" />
            <span className="warda-wave3 w-[3px] h-3 bg-blush-500 rounded-full" />
          </div>
        ) : (
          <svg viewBox="0 0 24 24" className="w-5 h-5 text-blush-600" fill="currentColor">
            <path d="M8 5v14l11-7z" />
          </svg>
        )}
      </button>
    </>
  )
}