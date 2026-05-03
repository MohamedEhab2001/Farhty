import { useTemplateData, useTemplateFields, PasswordGate, LoadingScreen, PreviewBanner } from '@farhty/template-sdk'
import AdminDashboard from './components/AdminDashboard'
import EnvelopeReveal from './components/EnvelopeReveal'
import HeroSection from './components/HeroSection'
import MusicPlayer from './components/MusicPlayer'
import CountdownTimer from './components/CountdownTimer'
import Schedule from './components/Schedule'
import VenueMap from './components/VenueMap'
import RSVPSection from './components/RSVPSection'
import WishWall from './components/WishWall'
import ClosingPage from './components/ClosingPage'
import FallingPetals from './components/FallingPetals'
import { useState, useEffect } from 'react'

export default function App() {
  const { instance, isLoading, isAuthenticated } = useTemplateData()
  const { get } = useTemplateFields()
  const isAdminRoute = window.location.pathname === '/admin'
  const [envelopeOpened, setEnvelopeOpened] = useState(() => {
    return localStorage.getItem('farhty_envelope_warda') === 'opened'
  })

  if (isLoading) return <LoadingScreen bg="#FFF8F6" />

  if (isAdminRoute) {
    if (!isAuthenticated) return <PasswordGate />
    return <AdminDashboard />
  }

  const features = instance?.features ?? {} as Record<string, unknown>
  const showEnvelope = !!features.envelopeIntro && !envelopeOpened
  const showMusic = !!features.music
  const showCountdown = !!features.countdownTimer
  const showSchedule = !!features.schedule
  const showVenueMap = !!features.venueMap
  const showRsvp = !!features.rsvp
  const showWishWall = !!features.wishWall
  const showFallingPetals = !!features.fallingPetals

  const handleEnvelopeOpen = () => {
    localStorage.setItem('farhty_envelope_warda', 'opened')
    setEnvelopeOpened(true)
  }

  if (showEnvelope) {
    return (
      <>
        {instance?.isPreview && <PreviewBanner templateName={instance.templateId} />}
        <EnvelopeReveal onOpen={handleEnvelopeOpen} />
        {showMusic && <MusicPlayer src={get('music_file')} autoPlayTrigger={handleEnvelopeOpen} />}
      </>
    )
  }

  return (
    <div dir="rtl" className="min-h-screen bg-blush-50 font-tajawal">
      {instance?.isPreview && <PreviewBanner templateName={instance.templateId} />}
      {showFallingPetals && <FallingPetals />}

      <HeroSection />
      {showMusic && <MusicPlayer src={get('music_file')} />}
      {showCountdown && <CountdownTimer date={get('wedding_date')} />}
      {showSchedule && <Schedule items={get('schedule_items')} />}
      {showVenueMap && <VenueMap
        name={get('venue_name')}
        address={get('venue_address')}
        mapImage={get('venue_map_image')}
      />}
      {showRsvp && <RSVPSection />}
      {showWishWall && <WishWall />}
      <ClosingPage />
    </div>
  )
}