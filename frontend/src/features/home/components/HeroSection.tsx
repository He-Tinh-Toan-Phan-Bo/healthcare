"use client"

import { Button } from "@/shared/ui/button"
import { Input } from "@/shared/ui/input"
import { Search } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { ROUTES } from "@/shared/constants"

export function HeroSection() {
    return (
        <section className="bg-gradient-to-br from-blue-50 via-white to-teal-50 py-8 md:py-12">
            <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid items-center gap-6 lg:grid-cols-2 lg:gap-8">
                    <div className="space-y-4">
                        <h1 className="text-2xl font-bold leading-tight text-balance text-foreground sm:text-3xl lg:text-4xl">
                            Đặt lịch khám tại phòng khám uy tín
                        </h1>
                        <p className="text-base text-muted-foreground text-pretty sm:text-lg">
                            Chọn phòng khám, chọn dịch vụ và đặt lịch khám trong vài phút. Chăm sóc sức khỏe dễ dàng và nhanh
                            chóng.
                        </p>

                        <div className="flex flex-col gap-2 rounded-xl border bg-white p-3 shadow-lg sm:flex-row sm:items-center sm:gap-3 sm:p-2">
                            <div className="flex flex-1 items-center gap-2">
                                <Search className="ml-2 h-5 w-5 shrink-0 text-muted-foreground" />
                                <Input
                                    placeholder="Tìm phòng khám, dịch vụ hoặc địa điểm..."
                                    className="border-0 focus-visible:ring-0"
                                />
                            </div>
                            <Button className="w-full shrink-0 bg-primary sm:w-auto">Tìm kiếm</Button>
                        </div>

                        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                            <Link href={ROUTES.BOOKING} className="w-full sm:w-auto">
                                <Button size="lg" className="w-full bg-primary text-white hover:bg-primary/90 sm:w-auto">
                                    Đặt Lịch Ngay
                                </Button>
                            </Link>
                            <Link href="/#clinics" className="w-full sm:w-auto">
                                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                                    Xem Phòng Khám
                                </Button>
                            </Link>
                        </div>
                    </div>

                    <div className="relative mt-6 lg:mt-0">
                        <div className="rounded-2xl bg-white p-3 shadow-xl sm:p-4">
                            <div className="space-y-3">
                                <h3 className="text-base font-semibold sm:text-lg">Chăm sóc sức khỏe theo tiện lợi của bạn</h3>
                                <p className="text-sm text-muted-foreground">
                                    Đội ngũ bác sĩ giàu kinh nghiệm và chuyên môn y tế chuyên nghiệp cam kết mang đến dịch vụ chăm sóc
                                    sức khỏe chất lượng trong môi trường thoải mái.
                                </p>
                                <Image
                                    src="/friendly-doctor-consulting-with-patient-in-modern-.jpg"
                                    alt="Doctor consulting with patient"
                                    width={400}
                                    height={240}
                                    className="rounded-lg"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
