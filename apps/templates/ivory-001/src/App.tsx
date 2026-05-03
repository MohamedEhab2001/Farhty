import { useTemplateData, useTemplateFields, PasswordGate, LoadingScreen, CustomerDashboard, PreviewBanner } from '@farhty/template-sdk'
import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import EnvelopeReveal from './components/EnvelopeReveal'
import HeroSection from './components/HeroSection'
import Countdown from './components/Countdown'
import Gallery from './components/Gallery'
import DayProgram from './components/DayProgram'
import RSVPSection from './components/RSVPSection'
import WishWall from './components/WishWall'
import VenueMap from './components/VenueMap'
import ShareButton from './components/ShareButton'
import OrnamentalDivider from './components/OrnamentalDivider'
import CustomQuote from './components/CustomQuote'
import ParentsSection from './components/ParentsSection'
import Footer from './components/Footer'

export default function App() {
  const { instance, isLoading, isAuthenticated } = useTemplateData()
  const { get } = useTemplateFields()
  const isAdminRoute = window.location.pathname === '/admin'
  const [envelopeOpened, setEnvelopeOpened] = useState(false)

  if (isLoading) return <LoadingScreen bg="#fefdfb" />

  if (isAdminRoute) {
    if (!isAuthenticated) return <PasswordGate />
    return <CustomerDashboard />
  }

  if (!isAuthenticated || !instance) {
    return <PasswordGate />
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const features = instance.features as Record<string, any>
  const showEnvelope = features.envelopeIntro ?? true

  return (
    <>
      {instance.isPreview && <PreviewBanner templateName={instance.templateId} />}

      <AnimatePresence>
        {showEnvelope && !envelopeOpened && (
          <EnvelopeReveal onOpen={() => setEnvelopeOpened(true)} />
        )}
      </AnimatePresence>

      {(!showEnvelope || envelopeOpened) && (
        <div dir="rtl" className="font-body" style={{ paddingTop: instance.isPreview ? 44 : 0 }}>
          {features.hero !== false && (
            <HeroSection
              heroImage={get('hero_image') ?? ''}
              brideName={get('bride_name') ?? 'ليلى'}
              groomName={get('groom_name') ?? 'كريم'}
              accentColor={get('accent_color') ?? '#c9a96e'}
            />
          )}

          <OrnamentalDivider />

          {features.parents !== false && (
            <ParentsSection
              brideName={get('bride_name') ?? 'ليلى'}
              groomName={get('groom_name') ?? 'كريم'}
              brideFather={get('bride_father_name') ?? ''}
              groomFather={get('groom_father_name') ?? ''}
              accentColor={get('accent_color') ?? '#c9a96e'}
            />
          )}

          <OrnamentalDivider />

          {features.countdownTimer && (
            <Countdown
              weddingDate={get('wedding_date') ?? ''}
              accentColor={get('accent_color') ?? '#c9a96e'}
              weddingTime={get('wedding_time') ?? ''}
            />
          )}

          {features.customQuote && (
            <>
              <CustomQuote
                quote={get('custom_quote') ?? ''}
                accentColor={get('accent_color') ?? '#c9a96e'}
              />
              <OrnamentalDivider />
            </>
          )}

          {features.schedule && (
            <>
              <DayProgram
                items={get('schedule_items') ?? []}
                accentColor={get('accent_color') ?? '#c9a96e'}
              />
              <OrnamentalDivider />
            </>
          )}

          {features.gallery && (
            <>
              <Gallery
                images={get('gallery_images') ?? []}
                accentColor={get('accent_color') ?? '#c9a96e'}
              />
              <OrnamentalDivider />
            </>
          )}

          {features.rsvp && (
            <>
              <RSVPSection accentColor={get('accent_color') ?? '#c9a96e'} />
              <OrnamentalDivider />
            </>
          )}

          {features.wishWall && (
            <>
              <WishWall accentColor={get('accent_color') ?? '#c9a96e'} />
              <OrnamentalDivider />
            </>
          )}

          {features.venueMap && (
            <>
              <VenueMap
                venueName={get('venue_name') ?? 'قاعة الأفراح'}
                venueAddress={get('venue_address') ?? ''}
                venueCoords={get('venue_coords') ?? ''}
                accentColor={get('accent_color') ?? '#c9a96e'}
              />
              <OrnamentalDivider />
            </>
          )}

          {features.shareButton && (
            <ShareButton accentColor={get('accent_color') ?? '#c9a96e'} />
          )}

          <Footer accentColor={get('accent_color') ?? '#c9a96e'} />
        </div>
      )}
    </>
  )
}