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
  const isAdminRoute = window.location.pathname === '/admin' || window.location.pathname === '/admin/'

  if (isLoading) return <LoadingScreen bg="#FDFAF4" />

  if (isAdminRoute) {
    if (!isAuthenticated) return <PasswordGate />
    return <AdminDashboard />
  }

  const accentColor = get('accent_color') ?? '#C4A35A'

  return (
    <div
      className="min-h-[100dvh]"
      style={{ '--gold': accentColor } as React.CSSProperties}
    >
      {instance?.isPreview && <PreviewBanner templateName="Ahd" />}

      {/* 1. Hero — 50/50 split */}
      <HeroSection />

      {/* Botanical line divider */}
      <BotanicalDivider />

      {/* 2. Countdown */}
      {instance?.features.countdown && get('section_countdown_visible') !== false && <CountdownSection />}

      {/* 3. Our Story */}
      {instance?.features.ourStory && get('section_ourstory_visible') !== false && <OurStorySection />}

      {/* 4. Event Details — ceremony + reception cards */}
      {instance?.features.eventDetails && get('section_eventdetails_visible') !== false && <EventDetailsSection />}

      {/* 5. Location / Map */}
      {instance?.features.venueMap && get('section_location_visible') !== false && <LocationSection />}

      {/* 6. RSVP */}
      {instance?.features.rsvp && get('section_rsvp_visible') !== false && <RSVPSection />}

      {/* 6. Wish Wall */}
      {instance?.features.wishWall && get('section_wishwall_visible') !== false && <WishWall />}

      {/* 7. Gallery */}
      {instance?.features.gallery && get('section_gallery_visible') !== false && <GallerySection />}

      {/* Share button — floating */}
      {instance?.features.shareButton && get('section_sharebutton_visible') !== false && <ShareButton />}

      {/* Footer */}
      <Footer />
    </div>
  )
}
