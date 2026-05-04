import { useEffect, useState } from 'react'

interface LoadingScreenProps {
  bg?: string
}

export function LoadingScreen({ bg = '#0d0b0e' }: LoadingScreenProps) {
  const [show, setShow] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setShow(false), 800)
    return () => clearTimeout(t)
  }, [])

  if (!show) return null

  return (
    <div
      style={{
        position: 'fixed', inset: 0, backgroundColor: bg,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 9999,
      }}
    >
      <style>{`
        @keyframes farhty-pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.12); opacity: 0.7; }
        }
        @keyframes farhty-ring {
          0%, 100% { box-shadow: 0 0 0 0 rgba(200,151,58,0.4); }
          50% { box-shadow: 0 0 0 20px rgba(200,151,58,0); }
        }
        .farhty-loading-logo {
          animation: farhty-pulse 1.2s ease-in-out infinite, farhty-ring 1.2s ease-in-out infinite;
        }
      `}</style>
      <div style={{ textAlign: 'center' }}>
        <img
          src="/فرحتي بنفسجي.png"
          alt="فرحتي"
          className="farhty-loading-logo"
          style={{
            width: 120,
            height: 120,
            objectFit: 'contain',
            margin: '0 auto 16px',
            display: 'block',
            borderRadius: 18,
          }}
        />
      </div>
    </div>
  )
}
