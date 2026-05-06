import { useTemplateData, useTemplateFields, LoadingScreen, PasswordGate, PreviewBanner } from '@farhty/template-sdk'
import AdminDashboard from './components/AdminDashboard'
import HeroSection from './components/HeroSection'
import QuranSection from './components/QuranSection'
import CountdownSection from './components/CountdownSection'
import CoupleSection from './components/CoupleSection'
import EventsSection from './components/EventsSection'
import VenueSection from './components/VenueSection'
import RSVPSection from './components/RSVPSection'
import WishWall from './components/WishWall'
import MusicPlayer from './components/MusicPlayer'

export default function App() {
  const { instance, isLoading, isAuthenticated } = useTemplateData()
  const { get } = useTemplateFields()
  const isAdminRoute = window.location.pathname === '/admin'

  // 1. Always show loading screen first
  if (isLoading) return <LoadingScreen bg="oklch(0.22 0.06 155)" />

  // 2. /admin route only: password gate then styled dashboard
  if (isAdminRoute) {
    if (!isAuthenticated) return <PasswordGate />
    return <AdminDashboard />
  }

  // 3. Public invitation — no auth, no admin UI ever
  return (
    <main
      className="min-h-screen text-ivory overflow-x-hidden"
      style={{ background: 'var(--gradient-emerald)' }}
    >
      {instance?.isPreview && <PreviewBanner templateName="Wedding Bliss Arabia" />}

      {instance?.features.music && <MusicPlayer />}

      <HeroSection />

      {instance?.features.quranVerse && <QuranSection />}

      {instance?.features.countdown && <CountdownSection />}

      <CoupleSection />

      {instance?.features.events && <EventsSection />}

      {instance?.features.venueMap && <VenueSection />}

      {instance?.features.rsvp && <RSVPSection />}

      {instance?.features.wishWall && <WishWall />}

      <footer className="py-12 text-center border-t border-gold/20">
        <p dir="rtl" className="font-arabic text-xl text-gold">
          {get('bride_name_ar') ?? 'ليلى'} و {get('groom_name_ar') ?? 'كريم'}
        </p>
        <p className="mt-2 text-xs tracking-[0.4em] uppercase text-ivory/50">
          {get('wedding_date') ?? ''}
        </p>
        <p className="mt-4 text-[0.6rem] tracking-[0.3em] uppercase text-ivory/30">
          Designed with love by Farhty
        </p>
      </footer>
    </main>
  )
}
