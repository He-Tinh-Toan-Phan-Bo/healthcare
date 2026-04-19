"use client"

import { useEffect, useState } from "react"
import { getDoctors } from "@/api/doctors"
import type { Doctor } from "@/shared/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card"
import { Button } from "@/shared/ui/button"
import { Badge } from "@/shared/ui/badge"
import { Star, ArrowRight, User } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { ROUTES } from "@/shared/constants"
import { HOME_TEXTS } from "@/shared/constants/home"
import { useLanguage } from "@/shared/provider/LanguageProvider"

import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/shared/ui/carousel"

export function DoctorsSection() {
    const { t } = useLanguage()
    const [doctors, setDoctors] = useState<Doctor[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        async function fetchData() {
            try {
                const data = await getDoctors({ limit: 10 })
                setDoctors(data.items)
            } catch (error) {
                console.error("Error fetching doctors:", error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchData()
    }, [])

    if (isLoading) {
        return (
            <section className="py-12 md:py-16">
                <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-48 items-center justify-center">
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                    </div>
                </div>
            </section>
        )
    }

    if (doctors.length === 0) return null

    return (
        <section className="py-12 md:py-16 bg-white">
            <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between md:mb-12">
                    <div>
                        <h2 className="mb-2 text-2xl font-bold sm:text-3xl font-heading">{t(HOME_TEXTS.DOCTORS.TITLE.vi, HOME_TEXTS.DOCTORS.TITLE.en)}</h2>
                        <p className="text-sm text-muted-foreground sm:text-base">{t(HOME_TEXTS.DOCTORS.DESC.vi, HOME_TEXTS.DOCTORS.DESC.en)}</p>
                    </div>
                    <Link href={ROUTES.DOCTORS} className="w-full sm:w-auto">
                        <Button variant="outline" className="gap-2 border-primary/20 text-primary hover:bg-primary/5 transition-colors">
                            {t(HOME_TEXTS.DOCTORS.VIEW_ALL.vi, HOME_TEXTS.DOCTORS.VIEW_ALL.en)}
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
                        {doctors.map((doctor) => (
                            <CarouselItem key={doctor.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                                <Card className="overflow-hidden border-none shadow-md transition-all duration-300 hover:shadow-xl group h-full flex flex-col p-0 gap-0">
                                    <div className="relative aspect-square overflow-hidden bg-slate-100 flex-none">
                                        {doctor.image || doctor.avatar ? (
                                            <Image
                                                src={doctor.image || doctor.avatar || ""}
                                                alt={doctor.name}
                                                fill
                                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center text-slate-300">
                                                <User className="h-20 w-20" />
                                            </div>
                                        )}
                                        <div className="absolute top-3 right-3">
                                            <Badge className="bg-white/90 text-primary backdrop-blur-sm border-none shadow-sm">
                                                {doctor.specialty?.name || "Bác sĩ"}
                                            </Badge>
                                        </div>
                                    </div>
                                    <CardHeader className="p-4 pt-5 pb-2 flex-1">
                                        <CardTitle className="text-lg font-bold group-hover:text-primary transition-colors">{doctor.name}</CardTitle>
                                        <div className="flex items-center gap-1 text-sm text-amber-500 font-medium">
                                            <Star className="h-4 w-4 fill-current" />
                                            <span>{doctor.rating || 5.0}</span>
                                            <span className="text-muted-foreground ml-1">({doctor.reviewCount || 0}+ lượt khám)</span>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-4 pt-0 flex-none flex flex-col gap-3">
                                        <p className="text-sm text-muted-foreground line-clamp-1 italic">
                                            {doctor.experience}+ {t(HOME_TEXTS.DOCTORS.YEARS_EXP.vi, HOME_TEXTS.DOCTORS.YEARS_EXP.en)}
                                        </p>
                                        <Link href={ROUTES.BOOKING} className="w-full mt-auto">
                                            <Button variant="secondary" className="w-full group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-sm active:scale-95">
                                                {t(HOME_TEXTS.DOCTORS.BOOK_NOW.vi, HOME_TEXTS.DOCTORS.BOOK_NOW.en)}
                                            </Button>
                                        </Link>
                                    </CardContent>
                                </Card>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    {doctors.length > 3 && (
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

