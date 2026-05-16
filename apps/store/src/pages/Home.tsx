import { useState } from 'react'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import HowItWorks from '../components/HowItWorks'
import TemplatesGrid from '../components/TemplatesGrid'
import Testimonials from '../components/Testimonials'
import TrustBadges from '../components/TrustBadges'
import FAQ from '../components/FAQ'
import Footer from '../components/Footer'
import BuyModal from '../components/BuyModal'
import StickyMobileCTA from '../components/StickyMobileCTA'
import { CtaBanner } from '../components/CtaBanner'
import { CursorGlow } from '../components/CursorGlow'
import PromoBanners from '../components/PromoBanners'
import PromoPopup from '../components/PromoPopup'
import { Template } from '../hooks/useTemplates'
import { usePromos } from '../hooks/usePromos'

export default function Home() {
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)
  const { banners, popup } = usePromos()

  return (
    <div dir="rtl">
      <CursorGlow />
      <Navbar />

      <main id="main-content" className="flex flex-col pb-24">
        <Hero />
        <PromoBanners banners={banners} />
        <TemplatesGrid onBuy={setSelectedTemplate} />
        <HowItWorks />
        <Testimonials />
        <TrustBadges />
        <FAQ />
        <CtaBanner />
      </main>

      <Footer />

      {/* Floating UI */}
      <BuyModal template={selectedTemplate} onClose={() => setSelectedTemplate(null)} />
      <PromoPopup popup={popup} />
      {/* <FakePurchaseToast /> */}
      <StickyMobileCTA />
    </div>
  )
}
