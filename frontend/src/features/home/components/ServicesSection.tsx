"use client"

import { Card, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card"
import { Stethoscope, Heart, TestTube, Syringe } from "lucide-react"
import { HOME_TEXTS } from "@/shared/constants/home"
import { ROUTES } from "@/shared/constants"
import Link from "next/link"

const iconMap = {
    Stethoscope: Stethoscope,
    Heart: Heart,
    TestTube: TestTube,
    Syringe: Syringe,
}

import { useEffect, useState } from "react"
import { getSpecialties, type Specialty } from "@/api/specialties"
import { useLanguage } from "@/shared/provider/LanguageProvider"

import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/shared/ui/carousel"

export function ServicesSection() {
    const { t } = useLanguage()
    const [specialties, setSpecialties] = useState<Specialty[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        async function fetchData() {
            try {
                const data = await getSpecialties()
                setSpecialties(data)
            } catch (error) {
                console.error("Error fetching specialties:", error)
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
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent shadow-lg" />
                    </div>
                </div>
            </section>
        )
    }

    if (specialties.length === 0) return null

    return (
        <section className="py-12 md:py-16 bg-slate-50/50">
            <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mb-8 text-center md:mb-12">
                    <h2 className="mb-3 text-2xl font-bold text-balance sm:text-3xl md:mb-4">{t(HOME_TEXTS.SERVICES.TITLE.vi, HOME_TEXTS.SERVICES.TITLE.en)}</h2>
                    <p className="text-sm text-muted-foreground text-pretty sm:text-base">
                        {t(HOME_TEXTS.SERVICES.DESC.vi, HOME_TEXTS.SERVICES.DESC.en)}
                    </p>
                </div>

                <Carousel
                    opts={{
                        align: "start",
                        loop: false,
                    }}
                    className="w-full"
                >
                    <CarouselContent className="-ml-4">
                        {specialties.map((specialty, index) => {
                            const Icon = [Stethoscope, Heart, TestTube, Syringe][index % 4]
                            const colors = [
                                "bg-blue-50 text-blue-600",
                                "bg-rose-50 text-rose-600",
                                "bg-teal-50 text-teal-600",
                                "bg-amber-50 text-amber-600"
                            ][index % 4]

                            return (
                                <CarouselItem key={specialty.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                                    <Link href={ROUTES.CLINICS} className="h-full block">
                                        <Card className="group transition-all duration-300 hover:shadow-xl hover:-translate-y-1 h-full border-none shadow-sm">
                                            <CardHeader>
                                                <div className={`mb-4 flex h-14 w-14 items-center justify-center rounded-2xl transition-transform group-hover:scale-110 ${colors.split(' ')[0]} ${colors.split(' ')[1]}`}>
                                                    <Icon className="h-7 w-7" />
                                                </div>
                                                <CardTitle className="group-hover:text-primary transition-colors">{specialty.name}</CardTitle>
                                                <CardDescription className="line-clamp-2">{specialty.description || t(HOME_TEXTS.SERVICES.DEFAULT_DESC.vi, HOME_TEXTS.SERVICES.DEFAULT_DESC.en)}</CardDescription>
                                            </CardHeader>
                                        </Card>
                                    </Link>
                                </CarouselItem>
                            )
                        })}
                    </CarouselContent>
                    {specialties.length > 3 && (
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


