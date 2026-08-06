import { ReactNode, useState } from 'react'
import Sidebar from './Sidebar'

interface LayoutProps {
  children: ReactNode
  title: string
}

export default function Layout({ children, title }: LayoutProps) {
  const [navOpen, setNavOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#0d0b0e]" dir="rtl">
      <Sidebar open={navOpen} onClose={() => setNavOpen(false)} />
      <div className="lg:mr-60">
        {/* Topbar */}
        <header className="sticky top-0 z-10 bg-[#0d0b0e]/80 backdrop-blur-xl border-b border-[#2e2840] px-4 sm:px-6 lg:px-8 h-16 flex items-center gap-3">
          <button
            onClick={() => setNavOpen(true)}
            className="lg:hidden text-[#f0e8d8] p-1 -m-1"
            aria-label="فتح القائمة"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
          <h1 className="font-bold text-[#f0e8d8] text-base sm:text-lg truncate">{title}</h1>
        </header>
        {/* Content */}
        <main className="p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
