import { useTemplateData, useTemplateFields, LoadingScreen, PasswordGate, PreviewBanner } from '@farhty/template-sdk'
import AdminDashboard from './components/AdminDashboard'
import HeroSection from './components/HeroSection'
import CountdownSection from './components/CountdownSection'
import LocationSection from './components/LocationSection'
import RSVPSection from './components/RSVPSection'
import WishingWall from './components/WishingWall'
import FluidCursor from './components/FluidCursor'
import useScrollReveal from './hooks/useScrollReveal'

export default function App() {
  const { instance, isLoading, isAuthenticated } = useTemplateData()
  const { get } = useTemplateFields()
  const isAdminRoute = window.location.pathname === '/admin'

  useScrollReveal()

  // 1. Always show loading screen first
  if (isLoading) return <LoadingScreen bg="#FAF5EE" />

  // 2. /admin route only: password gate then styled dashboard
  if (isAdminRoute) {
    if (!isAuthenticated) return <PasswordGate />
    return <AdminDashboard />
  }

  // 3. Public invitation — no auth, no admin UI ever
  return (
    <div className="min-h-screen bg-ivory">
      {instance?.isPreview && <PreviewBanner templateName="فيروز" />}

      <HeroSection />

      {instance?.features.countdown && <CountdownSection />}

      {instance?.features.location && <LocationSection />}

      {instance?.features.rsvp && <RSVPSection />}

      {instance?.features.wishWall && <WishingWall />}

      {/* Footer */}
      <footer className="py-8 text-center bg-mahogany text-cream/60">
        <p className="font-naskh text-sm">
          صُمّمت بكل حب بواسطة <span className="text-gold font-bold">فرحتي</span>
        </p>
      </footer>

      <FluidCursor />
    </div>
  )
}
