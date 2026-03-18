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

export default function ClinicsPage() {
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
            <h1 className="mb-2 text-2xl font-bold sm:text-3xl">Tất Cả Phòng Khám</h1>
            <p className="text-sm text-muted-foreground sm:text-base">Tìm và đặt lịch tại các phòng khám uy tín</p>
          </div>

          {/* Search and Filter */}
          <Card className="mb-6">
            <CardContent className="px-3 py-2.5 sm:px-4 sm:py-3">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
                <div className="relative w-full max-w-sm sm:max-w-md">
                  <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Tìm phòng khám..."
                    className="h-8 pl-8 text-sm"
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                  />
                </div>
                <div className="flex shrink-0 gap-2">
                  <Button variant="outline" size="sm" className="h-8 px-3 text-xs">Địa điểm</Button>
                  <Button variant="outline" size="sm" className="h-8 px-3 text-xs">Dịch vụ</Button>
                  <Button size="sm" className="h-8 bg-primary px-4 text-xs">Tìm kiếm</Button>
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
                <Card key={clinic.id} className="flex flex-col transition-shadow hover:shadow-lg">
                <div className="relative aspect-[2/1] w-full overflow-hidden rounded-t-lg bg-muted">
                  <Image
                    src={clinic.image || `/modern-clinic-.jpg?height=200&width=400&query=modern clinic ${clinic.id}`}
                    alt={clinic.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardHeader className="flex-none pb-3">
                  <div className="mb-2 flex items-start justify-between gap-2">
                    <CardTitle className="line-clamp-1 text-base sm:text-lg">{clinic.name}</CardTitle>
                    <Badge
                      variant="secondary"
                      className={
                        clinic.isOpen ? "shrink-0 bg-success/10 text-success" : "shrink-0 bg-muted text-muted-foreground"
                      }
                    >
                      <span className="mr-1">●</span>
                      {clinic.isOpen ? "Đang Mở" : "Đóng"}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{clinic.rating}</span>
                    <span className="text-muted-foreground">({clinic.reviewCount} đánh giá)</span>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 space-y-2.5">
                  <div className="flex items-start gap-2 text-sm">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                    <span className="line-clamp-2 text-muted-foreground">{clinic.address}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <span className="text-muted-foreground">{clinic.openingHours || "—"}</span>
                  </div>
                </CardContent>
                <CardFooter className="gap-2">
                  <Link href={`/clinic/${clinic.id}`} className="flex-1">
                    <Button variant="outline" className="w-full bg-transparent">
                      Xem Chi Tiết
                    </Button>
                  </Link>
                  <Link href="/booking" className="flex-1">
                    <Button className="w-full bg-primary">Đặt Lịch</Button>
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
