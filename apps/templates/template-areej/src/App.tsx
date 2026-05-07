import {
  useTemplateData,
  useTemplateFields,
  LoadingScreen,
  PasswordGate,
  PreviewBanner,
} from '@farhty/template-sdk'
import AdminDashboard from './components/AdminDashboard'
import EnvelopeReveal from './components/EnvelopeReveal'
import HeroSection from './components/HeroSection'
import GoldDivider from './components/GoldDivider'
import ParentsNames from './components/ParentsNames'
import CountdownSection from './components/CountdownSection'
import DayProgram from './components/DayProgram'
import LocationSection from './components/LocationSection'
import GallerySection from './components/GallerySection'
import RSVPSection from './components/RSVPSection'
import WishWall from './components/WishWall'
import MusicPlayer from './components/MusicPlayer'
import ShareButton from './components/ShareButton'
import FlyingPetals from './components/FlyingPetals'
import FloatingCharacters from './components/FloatingCharacters'
import MagneticCursor from './components/MagneticCursor'
import Footer from './components/Footer'
import { useState, useEffect } from 'react'

const defaultFeatures = {
  envelopeIntro: true,
  countdown: true,
  parentsNames: true,
  dayProgram: true,
  venueMap: true,
  gallery: true,
  rsvp: true,
  wishWall: true,
  music: true,
  shareButton: true,
}

export default function App() {
  const { instance, isLoading, isAuthenticated } = useTemplateData()
  const { get } = useTemplateFields()
  const isAdminRoute = window.location.pathname === '/admin'

  const [envelopeOpened, setEnvelopeOpened] = useState(() => {
    return sessionStorage.getItem('areej_envelope_opened') === 'true'
  })
  const [showContent, setShowContent] = useState(envelopeOpened)

  useEffect(() => {
    if (envelopeOpened) {
      sessionStorage.setItem('areej_envelope_opened', 'true')
    }
  }, [envelopeOpened])

  if (isLoading) return <LoadingScreen bg="#FFF9F5" />

  if (isAdminRoute) {
    if (!isAuthenticated) return <PasswordGate />
    return <AdminDashboard />
  }

  const features = instance?.features
    ? { ...defaultFeatures, ...(typeof instance.features === 'object' ? instance.features : {}) }
    : defaultFeatures

  const accentColor = get('accent_color') ?? '#D4627F'

  return (
    <div
      className="min-h-screen"
      style={{ '--rose': accentColor } as React.CSSProperties}
    >
      {instance?.isPreview && <PreviewBanner templateName="أريج" />}

      <FloatingCharacters />
      <FlyingPetals />

      {features.envelopeIntro && !envelopeOpened ? (
        <EnvelopeReveal onOpen={() => {
          setEnvelopeOpened(true)
          setTimeout(() => setShowContent(true), 800)
        }} />
      ) : null}

      {(!features.envelopeIntro || showContent) && (
        <>
          <HeroSection />
          <GoldDivider />

          {features.parentsNames && <ParentsNames />}
          {features.parentsNames && <GoldDivider />}

          {features.countdown && <CountdownSection />}
          {features.countdown && <GoldDivider />}

          {features.dayProgram && <DayProgram />}
          {features.dayProgram && <GoldDivider />}

          {features.venueMap && <LocationSection />}

          {features.gallery && <GallerySection />}
          {features.gallery && <GoldDivider />}

          {features.rsvp && <RSVPSection />}
          {features.wishWall && <WishWall />}

          <Footer />
        </>
      )}

      {features.music && <MusicPlayer />}
      {features.shareButton && <ShareButton />}
    </div>
  )
}