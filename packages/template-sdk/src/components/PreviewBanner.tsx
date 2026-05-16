interface PreviewBannerProps {
  templateName?: string
}

export function PreviewBanner({ templateName }: PreviewBannerProps) {
  return (
    <>
      <style>{`
        @keyframes farhty-banner-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.85; }
        }
        .farhty-preview-banner {
          animation: farhty-banner-pulse 2s ease-in-out infinite;
        }
      `}</style>
      <div
        className="farhty-preview-banner"
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 9997,
          background: 'linear-gradient(90deg, #c8973a, #e8b857, #c8973a)',
          padding: '10px 20px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          fontFamily: 'Cairo, sans-serif', direction: 'rtl',
        }}
      >
        <span style={{ color: '#0d0b0e', fontWeight: 700, fontSize: 14 }}>
          👀 هذه معاينة {templateName ? `لتصميم "${templateName}"` : ''} — اشترِ هذا التصميم الآن
        </span>
        <a
          href="https://farhty.online"
          target="_blank"
          rel="noopener noreferrer"
          id="preview-banner-buy-btn"
          style={{
            background: '#0d0b0e', color: '#e8b857', fontWeight: 900,
            fontSize: 13, padding: '6px 16px', borderRadius: 8,
            textDecoration: 'none', flexShrink: 0, marginRight: 16,
          }}
        >
          اطلب الآن ←
        </a>
      </div>
    </>
  )
}
