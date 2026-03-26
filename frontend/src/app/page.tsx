import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import {
  HeroSection,
  ServicesSection,
  PackagesSection,
  HealthGuideSection,
  ClinicsSection,
  DoctorsSection,
  HowItWorksSection,

  CTASection,
} from "@/features/home"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        <HeroSection />
        <ServicesSection />
        <PackagesSection />
        <HealthGuideSection />
        <ClinicsSection />
        <DoctorsSection />

        <HowItWorksSection />
        <CTASection />
      </main>

      <Footer />
    </div>
  )
}