"use client"

import { Button } from "@/shared/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/shared/ui/card"
import { Badge } from "@/shared/ui/badge"
import { Star, MapPin, Clock, ArrowRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { MOCK_CLINICS } from "@/shared/constants/mockData"
import { ROUTES } from "@/shared/constants"
import { HOME_TEXTS } from "@/shared/constants/home"

import { useEffect, useState } from "react"
import { getClinics } from "@/api/clinics"
import type { Clinic } from "@/shared/types"
import { useLanguage } from "@/shared/provider/LanguageProvider"

import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/shared/ui/carousel"

export function ClinicsSection() {
    const { t } = useLanguage()
    const [clinics, setClinics] = useState<Clinic[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        async function fetchData() {
            try {
                const data = await getClinics({ limit: 10 })
                setClinics(data.items)
            } catch (error) {
                console.error("Error fetching clinics:", error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchData()
    }, [])

    if (isLoading) {
        return (
            <section id="clinics" className="py-12 md:py-16">
                <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-64 items-center justify-center">
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent shadow-lg" />
                    </div>
                </div>
            </section>
        )
    }

    return (
        <section id="clinics" className="py-12 md:py-16">
            <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between md:mb-12">
                    <div>
                        <h2 className="mb-2 text-2xl font-bold sm:text-3xl">{t(HOME_TEXTS.CLINICS.TITLE.vi, HOME_TEXTS.CLINICS.TITLE.en)}</h2>
                        <p className="text-sm text-muted-foreground sm:text-base">{t(HOME_TEXTS.CLINICS.DESC.vi, HOME_TEXTS.CLINICS.DESC.en)}</p>
                    </div>
                    <Link href={ROUTES.CLINICS} className="w-full sm:w-auto">
                        <Button variant="outline" className="gap-2 bg-transparent text-primary border-primary/20 hover:bg-primary/5 transition-colors">
                            {t(HOME_TEXTS.CLINICS.VIEW_ALL.vi, HOME_TEXTS.CLINICS.VIEW_ALL.en)}
                            <ArrowRight className="h-4 w-4" />
                        </Button>
                    </Link>
                </div>

                <Carousel
                    opts={{
                        align: "start",
                        loop: false,
                    }}
                    className="w-full"
                >
                    <CarouselContent className="-ml-4">
                        {clinics.length > 0 ? clinics.map((clinic) => (
                            <CarouselItem key={clinic.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                                <Link href={ROUTES.CLINIC_DETAIL(clinic.id)}>
                                    <Card className="flex h-full flex-col p-0 gap-0 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl border-slate-100 group">
                                        <div className="relative aspect-[2/1] w-full overflow-hidden bg-muted flex-none">
                                            <Image 
                                                src={clinic.image || "/placeholder-clinic.jpg"} 
                                                alt={clinic.name} 
                                                fill 
                                                className="object-cover transition-transform duration-500 group-hover:scale-110" 
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                                        </div>
                                        <CardHeader className="flex-none pt-4 pb-2 px-6">
                                            <div className="mb-2 flex items-start justify-between gap-2">
                                                <CardTitle className="line-clamp-1 text-base sm:text-lg group-hover:text-primary transition-colors">{clinic.name}</CardTitle>
                                                <Badge
                                                    variant="secondary"
                                                    className={clinic.isOpen ? "shrink-0 bg-success/10 text-success" : "shrink-0 bg-muted text-muted-foreground"}
                                                >
                                                    <span className="mr-1">●</span> {clinic.isOpen ? t(HOME_TEXTS.PAGES.CLINICS.STATUS_OPEN.vi, HOME_TEXTS.PAGES.CLINICS.STATUS_OPEN.en) : t(HOME_TEXTS.PAGES.CLINICS.STATUS_CLOSED.vi, HOME_TEXTS.PAGES.CLINICS.STATUS_CLOSED.en)}
                                                </Badge>
                                            </div>
                                            <div className="flex items-center gap-1 text-sm">
                                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                                <span className="font-semibold">{clinic.rating}</span>
                                                <span className="text-muted-foreground">({clinic.numReviews || 0} {t(HOME_TEXTS.PAGES.CLINICS.REVIEWS.vi, HOME_TEXTS.PAGES.CLINICS.REVIEWS.en)})</span>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="flex-1 space-y-2.5 pt-0 px-6">
                                            <div className="flex items-start gap-2 text-sm">
                                                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary/70" />
                                                <span className="line-clamp-2 text-muted-foreground">{clinic.address}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm">
                                                <Clock className="h-4 w-4 shrink-0 text-primary/70" />
                                                <span className="text-muted-foreground">{clinic.openingHours}</span>
                                            </div>
                                        </CardContent>
                                        <CardFooter className="flex-none pt-2 pb-6 px-6">
                                            <Button className="w-full bg-primary hover:bg-primary/90 shadow-md transition-all active:scale-95">{t(HOME_TEXTS.PAGES.CLINICS.BOOK_NOW.vi, HOME_TEXTS.PAGES.CLINICS.BOOK_NOW.en)}</Button>
                                        </CardFooter>
                                    </Card>
                                </Link>
                            </CarouselItem>
                        )) : (
                            <p className="mt-4 text-sm text-center text-muted-foreground w-full col-span-full py-8">
                                {t(HOME_TEXTS.CLINICS.EMPTY.vi, HOME_TEXTS.CLINICS.EMPTY.en)}
                            </p>
                        )}
                    </CarouselContent>
                    {clinics.length > 3 && (
                        <>
                            <CarouselPrevious className="hidden md:flex -left-6 lg:-left-12 bg-white shadow-xl hover:bg-primary hover:text-white border-primary/10 disabled:hidden" />
                            <CarouselNext className="hidden md:flex -right-6 lg:-right-12 bg-white shadow-xl hover:bg-primary hover:text-white border-primary/10 disabled:hidden" />
                        </>
                    )}
                </Carousel>
            </div>
        </section>
    )
}


