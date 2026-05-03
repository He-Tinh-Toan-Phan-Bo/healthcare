"use client"

import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { Button } from "@/shared/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/shared/ui/card"
import { Input } from "@/shared/ui/input"
import { Badge } from "@/shared/ui/badge"
import { Search, Star, MapPin, Clock } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useQuery } from "@tanstack/react-query"
import { useMemo, useState } from "react"
import { getClinics } from "@/api/clinics"
import { useLanguage } from "@/shared/provider/LanguageProvider"
import { HOME_TEXTS } from "@/shared/constants/home"

export default function ClinicsPage() {
  const { t } = useLanguage()
  const [q, setQ] = useState("")

  const { data, isLoading } = useQuery({
    queryKey: ["clinics", { q }],
    queryFn: () => getClinics({ q: q || undefined }),
  })

  const clinics = useMemo(() => data?.items ?? [], [data])

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 py-6 md:py-8">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <h1 className="mb-2 text-2xl font-bold sm:text-3xl">{t(HOME_TEXTS.PAGES.CLINICS.TITLE.vi, HOME_TEXTS.PAGES.CLINICS.TITLE.en)}</h1>
            <p className="text-sm text-muted-foreground sm:text-base">{t(HOME_TEXTS.PAGES.CLINICS.DESC.vi, HOME_TEXTS.PAGES.CLINICS.DESC.en)}</p>
          </div>

          {/* Search and Filter */}
          <Card className="mb-8 w-fit shadow-sm border-gray-100">
            <CardContent className="px-3 py-2.5 sm:px-4 sm:py-3">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
                <div className="relative w-full max-w-[320px]">
                  <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder={t(HOME_TEXTS.PAGES.CLINICS.SEARCH_PLACEHOLDER.vi, HOME_TEXTS.PAGES.CLINICS.SEARCH_PLACEHOLDER.en)}
                    className="h-8 pl-8 text-sm"
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                  />
                </div>
                <div className="flex shrink-0 gap-2">
                  <Button variant="outline" size="sm" className="h-8 px-3 text-xs">{t(HOME_TEXTS.PAGES.CLINICS.LOCATION.vi, HOME_TEXTS.PAGES.CLINICS.LOCATION.en)}</Button>
                  <Button variant="outline" size="sm" className="h-8 px-3 text-xs">{t(HOME_TEXTS.PAGES.CLINICS.SERVICE.vi, HOME_TEXTS.PAGES.CLINICS.SERVICE.en)}</Button>
                  <Button size="sm" className="h-8 bg-primary px-4 text-xs">{t(HOME_TEXTS.PAGES.CLINICS.SEARCH_BTN.vi, HOME_TEXTS.PAGES.CLINICS.SEARCH_BTN.en)}</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Clinics Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {isLoading ? (
              Array.from({ length: 6 }).map((_, idx) => (
                <Card key={idx} className="flex flex-col">
                  <div className="relative aspect-[2/1] w-full overflow-hidden rounded-t-lg bg-muted" />
                  <CardHeader className="flex-none pb-3">
                    <div className="h-5 w-2/3 animate-pulse rounded bg-muted" />
                    <div className="mt-2 h-4 w-1/3 animate-pulse rounded bg-muted" />
                  </CardHeader>
                  <CardContent className="flex-1 space-y-2.5">
                    <div className="h-4 w-full animate-pulse rounded bg-muted" />
                    <div className="h-4 w-4/5 animate-pulse rounded bg-muted" />
                  </CardContent>
                </Card>
              ))
            ) : (
              clinics.map((clinic) => (
                <Card key={clinic.id} className="flex flex-col p-0 gap-0 overflow-hidden transition-shadow shadow-sm hover:shadow-lg group">
                <div className="relative aspect-[2/1] w-full flex-none overflow-hidden bg-muted">
                  <Image
                    src={clinic.image || `/modern-clinic-.jpg?height=200&width=400&query=modern clinic ${clinic.id}`}
                    alt={clinic.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <CardHeader className="flex-none pt-4 pb-2">
                  <div className="mb-2 flex items-start justify-between gap-2">
                    <CardTitle className="line-clamp-1 text-base sm:text-lg">{clinic.name}</CardTitle>
                    <Badge
                      variant="secondary"
                      className={
                        clinic.isOpen ? "shrink-0 bg-success/10 text-success" : "shrink-0 bg-muted text-muted-foreground"
                      }
                    >
                      <span className="mr-1">●</span>
                      {clinic.isOpen ? t(HOME_TEXTS.PAGES.CLINICS.STATUS_OPEN.vi, HOME_TEXTS.PAGES.CLINICS.STATUS_OPEN.en) : t(HOME_TEXTS.PAGES.CLINICS.STATUS_CLOSED.vi, HOME_TEXTS.PAGES.CLINICS.STATUS_CLOSED.en)}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{clinic.rating}</span>
                    <span className="text-muted-foreground">({clinic.reviewCount} {t(HOME_TEXTS.PAGES.CLINICS.REVIEWS.vi, HOME_TEXTS.PAGES.CLINICS.REVIEWS.en)})</span>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 space-y-2.5 pt-0">
                  <div className="flex items-start gap-2 text-sm">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                    <span className="line-clamp-2 text-muted-foreground">{clinic.address}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <span className="text-muted-foreground">{clinic.openingHours || "—"}</span>
                  </div>
                </CardContent>
                <CardFooter className="gap-2 pb-5 pt-4 flex-none mt-auto">
                  <Link href={`/clinic/${clinic.id}`} className="flex-1">
                    <Button variant="outline" className="w-full bg-transparent">
                      {t(HOME_TEXTS.PAGES.CLINICS.VIEW_DETAIL.vi, HOME_TEXTS.PAGES.CLINICS.VIEW_DETAIL.en)}
                    </Button>
                  </Link>
                  <Link href={`/booking?clinicId=${clinic.id}`} className="flex-1">
                    <Button className="w-full bg-primary">{t(HOME_TEXTS.PAGES.CLINICS.BOOK_NOW.vi, HOME_TEXTS.PAGES.CLINICS.BOOK_NOW.en)}</Button>
                  </Link>
                </CardFooter>
              </Card>
              ))
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
