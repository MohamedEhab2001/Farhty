import { useState } from 'react'

export default function ShareButton() {
  const [toast, setToast] = useState(false)

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
    } catch {
      // Fallback for older browsers
      const el = document.createElement('textarea')
      el.value = window.location.href
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
    }
    setToast(true)
    setTimeout(() => setToast(false), 2700)
  }

  return (
    <>
      {/* Floating share pill — bottom right */}
      <button
        onClick={handleShare}
        aria-label="Copy invitation link"
        style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          zIndex: 9000,
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          padding: '0.7rem 1.4rem',
          borderRadius: '999px',
          background: 'rgba(30,43,58,0.92)',
          backdropFilter: 'blur(8px)',
          color: '#F5E6C8',
          fontFamily: 'Jost, sans-serif',
          fontWeight: 300,
          fontSize: '0.68rem',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          border: '1px solid rgba(196,163,90,0.3)',
          cursor: 'pointer',
          boxShadow: '0 4px 24px rgba(0,0,0,0.18)',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        }}
        onMouseEnter={e => {
          ;(e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)'
          ;(e.currentTarget as HTMLButtonElement).style.boxShadow = '0 8px 32px rgba(0,0,0,0.22)'
        }}
        onMouseLeave={e => {
          ;(e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)'
          ;(e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 24px rgba(0,0,0,0.18)'
        }}
      >
        {/* Link icon */}
        <svg viewBox="0 0 20 20" fill="none" style={{ width: '14px', height: '14px' }}>
          <path
            d="M13 7H7M13 7V13M13 7L7 13"
            stroke="#C4A35A"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Share
      </button>

      {/* Toast */}
      {toast && (
        <div className="ahd-toast">
          Link copied to clipboard
        </div>
      )}
    </>
  )
}
