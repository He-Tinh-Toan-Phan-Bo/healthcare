"use client"

import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { useLanguage } from "@/shared/provider/LanguageProvider"
import { HOME_TEXTS } from "@/shared/constants/home"
import { PackagesSection } from "@/features/home/components/PackagesSection"

export default function PackagesPage() {
  const { t } = useLanguage()

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 py-12 bg-slate-50">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="mb-8 text-center">
            <h1 className="mb-3 text-3xl font-bold">{t(HOME_TEXTS.PACKAGES.TITLE.vi, HOME_TEXTS.PACKAGES.TITLE.en)}</h1>
            <p className="text-muted-foreground">{t(HOME_TEXTS.PACKAGES.DESC.vi, HOME_TEXTS.PACKAGES.DESC.en)}</p>
          </div>

          {/* Dùng lại cấu trúc PackagesSection */}
          <PackagesSection />
        </div>
      </main>

      <Footer />
    </div>
  )
}
