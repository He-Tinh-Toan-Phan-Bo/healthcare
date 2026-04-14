"use client"

import { Button } from "@/shared/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/shared/ui/card"
import { Badge } from "@/shared/ui/badge"
import { CheckCircle2, Star, ArrowRight } from "lucide-react"
import Link from "next/link"
import { MOCK_PACKAGES } from "@/shared/constants/mockData"
import { ROUTES } from "@/shared/constants"

export function PackagesSection() {
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("vi-VN").format(price) + "đ"
    }

    return (
        <section id="packages" className="bg-muted/30 py-12 md:py-16">
            <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between md:mb-12">
                    <div>
                        <h2 className="mb-3 text-2xl font-bold text-balance sm:text-3xl md:mb-4">Gói Khám Sức Khỏe</h2>
                        <p className="text-sm text-muted-foreground text-pretty sm:text-base">
                            Lựa chọn từ các gói tầm soát sức khỏe toàn diện được thiết kế phù hợp với nhu cầu của bạn
                        </p>
                    </div>
                    <Link href={ROUTES.BOOKING}>
                        <Button variant="outline" className="gap-2 bg-transparent">
                            Xem Tất Cả
                            <ArrowRight className="h-4 w-4" />
                        </Button>
                    </Link>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                    {MOCK_PACKAGES.map((pkg) => (
                        <Card key={pkg.id} className={pkg.isPopular ? "relative border-primary shadow-lg" : ""}>
                            {pkg.isPopular && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                                    <Badge className="bg-primary text-white">
                                        <Star className="mr-1 h-3 w-3" /> Phổ Biến Nhất
                                    </Badge>
                                </div>
                            )}
                            <CardHeader>
                                <CardTitle>{pkg.name}</CardTitle>
                                <CardDescription>{pkg.description}</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="text-3xl font-bold">
                                    {formatPrice(pkg.price)} <span className="text-sm font-normal text-muted-foreground">/ người</span>
                                </div>

                                <ul className="space-y-2">
                                    {pkg.features.map((feature, index) => (
                                        <li key={index} className="flex items-start gap-2">
                                            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-success" />
                                            <span className="text-sm">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                            <CardFooter>
                                <Link href={ROUTES.BOOKING} className="w-full">
                                    <Button variant={pkg.isPopular ? "default" : "outline"} className="w-full">
                                        Đặt Ngay
                                    </Button>
                                </Link>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    )
}
