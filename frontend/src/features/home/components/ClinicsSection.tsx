"use client"

import { Button } from "@/shared/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/shared/ui/card"
import { Badge } from "@/shared/ui/badge"
import { Star, MapPin, Clock, ArrowRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { MOCK_CLINICS } from "@/shared/constants/mockData"
import { ROUTES } from "@/shared/constants"

export function ClinicsSection() {
    return (
        <section id="clinics" className="py-12 md:py-16">
            <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between md:mb-12">
                    <div>
                        <h2 className="mb-2 text-2xl font-bold sm:text-3xl">Phòng Khám Nổi Bật</h2>
                        <p className="text-sm text-muted-foreground sm:text-base">Các phòng khám uy tín và chất lượng</p>
                    </div>
                    <Link href={ROUTES.CLINICS} className="w-full sm:w-auto">
                        <Button variant="outline" className="gap-2 bg-transparent">
                            Xem Tất Cả
                            <ArrowRight className="h-4 w-4" />
                        </Button>
                    </Link>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {MOCK_CLINICS.map((clinic) => (
                        <Link key={clinic.id} href={ROUTES.CLINIC_DETAIL(clinic.id)}>
                            <Card className="flex h-full flex-col transition-shadow hover:shadow-lg">
                                <div className="relative aspect-[2/1] w-full overflow-hidden rounded-t-lg bg-muted">
                                    <Image src={clinic.image} alt={clinic.name} fill className="object-cover" />
                                </div>
                                <CardHeader className="flex-none pb-3">
                                    <div className="mb-2 flex items-start justify-between gap-2">
                                        <CardTitle className="line-clamp-1 text-base sm:text-lg">{clinic.name}</CardTitle>
                                        <Badge
                                            variant="secondary"
                                            className={clinic.isOpen ? "shrink-0 bg-success/10 text-success" : "shrink-0 bg-muted text-muted-foreground"}
                                        >
                                            <span className="mr-1">●</span> {clinic.isOpen ? "Đang Mở" : "Đóng"}
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
                                        <span className="text-muted-foreground">{clinic.openingHours}</span>
                                    </div>
                                </CardContent>
                                <CardFooter className="flex-none">
                                    <Button className="w-full bg-primary">Đặt Lịch Khám</Button>
                                </CardFooter>
                            </Card>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    )
}
