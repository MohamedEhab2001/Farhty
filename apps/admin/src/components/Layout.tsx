import { ReactNode } from 'react'
import Sidebar from './Sidebar'

interface LayoutProps {
  children: ReactNode
  title: string
}

export default function Layout({ children, title }: LayoutProps) {
  return (
    <div className="min-h-screen bg-[#0d0b0e]" dir="rtl">
      <Sidebar />
      <div className="mr-60">
        {/* Topbar */}
        <header className="sticky top-0 z-20 bg-[#0d0b0e]/80 backdrop-blur-xl border-b border-[#2e2840] px-8 h-16 flex items-center">
          <h1 className="font-bold text-[#f0e8d8] text-lg">{title}</h1>
        </header>
        {/* Content */}
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
