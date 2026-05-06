import {
  useTemplateData,
  useTemplateFields,
  LoadingScreen,
  PasswordGate,
  PreviewBanner,
} from '@farhty/template-sdk'
import AdminDashboard from './components/AdminDashboard'
import HeroSection from './components/HeroSection'
import BotanicalDivider from './components/BotanicalDivider'
import CountdownSection from './components/CountdownSection'
import OurStorySection from './components/OurStorySection'
import EventDetailsSection from './components/EventDetailsSection'
import LocationSection from './components/LocationSection'
import RSVPSection from './components/RSVPSection'
import WishWall from './components/WishWall'
import GallerySection from './components/GallerySection'
import ShareButton from './components/ShareButton'
import Footer from './components/Footer'

export default function App() {
  const { instance, isLoading, isAuthenticated } = useTemplateData()
  const { get } = useTemplateFields()
  const isAdminRoute = window.location.pathname === '/admin'

  if (isLoading) return <LoadingScreen bg="#FDFAF4" />

  if (isAdminRoute) {
    if (!isAuthenticated) return <PasswordGate />
    return <AdminDashboard />
  }

  const accentColor = get('accent_color') ?? '#C4A35A'

  return (
    <div
      className="min-h-screen"
      style={{ '--gold': accentColor } as React.CSSProperties}
    >
      {instance?.isPreview && <PreviewBanner templateName="Ahd" />}

      {/* 1. Hero — 50/50 split */}
      <HeroSection />

      {/* Botanical line divider */}
      <BotanicalDivider />

      {/* 2. Countdown */}
      {instance?.features.countdown && <CountdownSection />}

      {/* 3. Our Story */}
      {instance?.features.ourStory && <OurStorySection />}

      {/* 4. Event Details — ceremony + reception cards */}
      {instance?.features.eventDetails && <EventDetailsSection />}

      {/* 5. Location / Map */}
      {instance?.features.venueMap && <LocationSection />}

      {/* 6. RSVP */}
      {instance?.features.rsvp && <RSVPSection />}

      {/* 6. Wish Wall */}
      {instance?.features.wishWall && <WishWall />}

      {/* 7. Gallery */}
      {instance?.features.gallery && <GallerySection />}

      {/* Share button — floating */}
      {instance?.features.shareButton && <ShareButton />}

      {/* Footer */}
      <Footer />
    </div>
  )
}
