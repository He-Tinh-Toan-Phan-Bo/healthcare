"use client"

import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { useLanguage } from "@/shared/provider/LanguageProvider"
import { HOME_TEXTS } from "@/shared/constants/home"
import { DoctorsSection } from "@/features/home/components/DoctorsSection"

export default function DoctorsPage() {
  const { t } = useLanguage()

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 py-12 bg-slate-50">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="mb-8 text-center">
            <h1 className="mb-3 text-3xl font-bold">{t(HOME_TEXTS.DOCTORS.TITLE.vi, HOME_TEXTS.DOCTORS.TITLE.en)}</h1>
            <p className="text-muted-foreground">{t(HOME_TEXTS.DOCTORS.DESC.vi, HOME_TEXTS.DOCTORS.DESC.en)}</p>
          </div>

          {/* Biểu diễn lại DoctorsSection cho chi tiết */}
          <DoctorsSection />
        </div>
      </main>

      <Footer />
    </div>
  )
}
