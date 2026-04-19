"use client"

import { Button } from "@/shared/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/shared/ui/card"
import { Badge } from "@/shared/ui/badge"
import { Check, Star, ArrowRight } from "lucide-react"
import Link from "next/link"
import { ROUTES } from "@/shared/constants"
import { useTranslation } from "react-i18next"
import { useQuery } from "@tanstack/react-query"
import { packageService } from "@/features/clinics/services/packageService"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/shared/ui/carousel"

export function PackagesSection() {
    const { t } = useTranslation("home")
    const { t: tp } = useTranslation("packages")
    const packagesQuery = useQuery({
        queryKey: ["packages", "all"],
        queryFn: () => packageService.getAll(),
    })

    const packages = packagesQuery.data?.data ?? []

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("vi-VN").format(price) + "đ"
    }

    return (
        <section id="packages" className="bg-muted/30 py-12 md:py-16">
            <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between md:mb-12">
                    <div>
                        <h2 className="mb-3 text-2xl font-bold text-balance sm:text-3xl md:mb-4">{t("packages.title")}</h2>
                        <p className="text-sm text-muted-foreground text-pretty sm:text-base">
                            {t("packages.desc")}
                        </p>
                    </div>
                    <Link href={ROUTES.PACKAGES}>
                        <Button variant="outline" className="gap-2 bg-transparent border-primary/20 text-primary hover:bg-primary/5 transition-colors">
                            {t("packages.view_all")}
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
                    {packagesQuery.isLoading ? (
                        <div className="flex justify-center p-8">
                            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                        </div>
                    ) : packages.length > 0 ? (
                        <CarouselContent className="-ml-4">
                            {packages.map((pkg) => (
                                <CarouselItem key={pkg.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                                    <Card className="flex h-full flex-col p-0 gap-0 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group">
                                        <CardHeader className="relative bg-muted/30 pb-4 px-6 pt-6">
                                            {pkg.isPopular && (
                                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                                                    <Badge className="bg-primary text-white shadow-sm">
                                                        <Star className="mr-1 h-3 w-3" /> {tp("popular_badge")}
                                                    </Badge>
                                                </div>
                                            )}
                                            <CardTitle className="text-xl group-hover:text-primary transition-colors mt-2">{pkg.name}</CardTitle>
                                            <CardDescription className="line-clamp-2 min-h-[40px] mt-1">{pkg.description}</CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-4 flex-1 pt-6 px-6">
                                            <div className="text-3xl font-bold text-primary">
                                                {formatPrice(pkg.price)} <span className="text-sm font-normal text-muted-foreground">{tp("per_person")}</span>
                                            </div>

                                            <ul className="space-y-3">
                                                {pkg.features.slice(0, 4).map((feature, i) => (
                                                    <li key={i} className="flex items-start">
                                                        <Check className="mr-2 mt-0.5 h-4 w-4 shrink-0 text-primary" />
                                                        <span className="text-sm text-foreground/80 leading-tight">{feature}</span>
                                                    </li>
                                                ))}
                                                {pkg.features.length > 4 && (
                                                    <li className="text-sm text-primary font-medium pl-6">
                                                        + {pkg.features.length - 4} {tp("others_count")}
                                                    </li>
                                                )}
                                            </ul>
                                        </CardContent>
                                        <CardFooter className="mt-auto pt-4 pb-6 px-6">
                                            <Link href={ROUTES.BOOKING} className="w-full">
                                                <Button variant={pkg.isPopular ? "default" : "outline"} className={`w-full group-hover:shadow-md transition-all ${!pkg.isPopular && 'border-primary/20 text-primary hover:bg-primary hover:text-white'}`}>
                                                    {tp("book_now")}
                                                </Button>
                                            </Link>
                                        </CardFooter>
                                    </Card>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                    ) : (
                        <p className="mt-4 text-sm text-center text-muted-foreground w-full">
                            {t("packages.empty")}
                        </p>
                    )}
                    {packages.length > 3 && (
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
