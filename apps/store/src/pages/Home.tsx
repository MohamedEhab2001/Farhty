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
import FakePurchaseToast from '../components/FakePurchaseToast'
import StickyMobileCTA from '../components/StickyMobileCTA'
import { Template } from '../hooks/useTemplates'

export default function Home() {
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)

  return (
    <div dir="rtl">
      <Navbar />

      <main id="main-content" className="flex flex-col gap-16 md:gap-24 pb-24">
        <Hero />
        <TemplatesGrid onBuy={setSelectedTemplate} />
        <HowItWorks />
        <Testimonials />
        <TrustBadges />
        <FAQ />
      </main>

      <Footer />

      {/* Floating UI */}
      <BuyModal template={selectedTemplate} onClose={() => setSelectedTemplate(null)} />
      <FakePurchaseToast />
      <StickyMobileCTA />
    </div>
  )
}
