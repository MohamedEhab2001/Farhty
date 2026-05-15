import { useTemplateData, useTemplateFields, LoadingScreen, PasswordGate, PreviewBanner } from '@farhty/template-sdk'
import AdminDashboard from './components/AdminDashboard'
import HeroSection from './components/HeroSection'
import CountdownSection from './components/CountdownSection'
import LocationSection from './components/LocationSection'
import RSVPSection from './components/RSVPSection'
import WishingWall from './components/WishingWall'
import FluidCursor from './components/FluidCursor'
import FallingPetals from './components/FallingPetals'
import { motion } from 'framer-motion'

export default function App() {
  const { instance, isLoading, isAuthenticated } = useTemplateData()
  const { get } = useTemplateFields()
  const isAdminRoute = window.location.pathname === '/admin' || window.location.pathname === '/admin/'

  // 1. Always show loading screen first
  if (isLoading) return <LoadingScreen bg="#FAF5EE" />

  // 2. /admin route only: password gate then styled dashboard
  if (isAdminRoute) {
    if (!isAuthenticated) return <PasswordGate />
    return <AdminDashboard />
  }

  // 3. Public invitation — no auth, no admin UI ever
  return (
    <div className="min-h-[100dvh] bg-ivory">
      {instance?.isPreview && <PreviewBanner templateName="فيروز" />}

      <FallingPetals />

      <HeroSection />

      {instance?.features.countdown && get('section_countdown_visible') !== false && <CountdownSection />}

      {instance?.features.location && get('section_location_visible') !== false && <LocationSection />}

      {instance?.features.rsvp && get('section_rsvp_visible') !== false && <RSVPSection />}

      {instance?.features.wishWall && get('section_wishwall_visible') !== false && <WishingWall />}

      {/* Footer */}
      <footer className="relative py-10 text-center overflow-hidden"
        style={{ background: 'linear-gradient(180deg, #4A2A18, #3D2117)' }}>
        {/* Subtle top glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[60px] opacity-10"
          style={{ background: 'radial-gradient(ellipse, #C9A96E, transparent 70%)' }} />

        <motion.div
          className="w-24 h-px mx-auto mb-4"
          style={{ background: 'linear-gradient(90deg, transparent, #C9A96E40, transparent)' }}
        />
        <p className="font-naskh text-sm text-cream/40">
          صنعت لكل حب بواسطة <span className="gold-shimmer font-bold">farhty.online</span>
        </p>
      </footer>

      <FluidCursor />
    </div>
  )
}
