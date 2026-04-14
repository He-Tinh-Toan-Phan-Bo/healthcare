"use client"

import { Card, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card"
import { Stethoscope, Heart, TestTube, Syringe } from "lucide-react"
import { MOCK_SERVICES } from "@/shared/constants/mockData"

const iconMap = {
    Stethoscope: Stethoscope,
    Heart: Heart,
    TestTube: TestTube,
    Syringe: Syringe,
}

export function ServicesSection() {
    return (
        <section className="py-12 md:py-16">
            <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mb-8 text-center md:mb-12">
                    <h2 className="mb-3 text-2xl font-bold text-balance sm:text-3xl md:mb-4">Dịch Vụ Của Chúng Tôi</h2>
                    <p className="text-sm text-muted-foreground text-pretty sm:text-base">
                        Các dịch vụ khám và chăm sóc sức khỏe toàn diện
                    </p>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {MOCK_SERVICES.map((service, index) => {
                        const Icon = iconMap[service.icon as keyof typeof iconMap] || Stethoscope
                        const bgColor = index % 2 === 0 ? "bg-primary/10" : "bg-secondary/10"
                        const iconColor = index % 2 === 0 ? "text-primary" : "text-secondary"

                        return (
                            <Card key={service.id} className="transition-shadow hover:shadow-lg">
                                <CardHeader>
                                    <div className={`mb-2 flex h-12 w-12 items-center justify-center rounded-lg ${bgColor}`}>
                                        <Icon className={`h-6 w-6 ${iconColor}`} />
                                    </div>
                                    <CardTitle>{service.name}</CardTitle>
                                    <CardDescription>{service.description}</CardDescription>
                                </CardHeader>
                            </Card>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
