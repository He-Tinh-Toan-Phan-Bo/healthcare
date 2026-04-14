"use client"

import { Button } from "@/shared/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card"
import { Badge } from "@/shared/ui/badge"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { MOCK_ARTICLES } from "@/shared/constants/mockData"
import { ROUTES } from "@/shared/constants"

export function HealthGuideSection() {
    return (
        <section id="guidebook" className="py-12 md:py-16">
            <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between md:mb-12">
                    <div>
                        <h2 className="mb-3 text-2xl font-bold text-balance sm:text-3xl md:mb-4">Cẩm Nang Sức Khỏe</h2>
                        <p className="text-sm text-muted-foreground text-pretty sm:text-base">
                            Kiến thức và lời khuyên sức khỏe từ các chuyên gia y tế
                        </p>
                    </div>
                    <Link href={ROUTES.HEALTH_GUIDE}>
                        <Button variant="outline" className="gap-2 bg-transparent">
                            Xem Tất Cả
                            <ArrowRight className="h-4 w-4" />
                        </Button>
                    </Link>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                    {MOCK_ARTICLES.map((article) => (
                        <Link key={article.id} href={`${ROUTES.HEALTH_GUIDE}/${article.slug}`}>
                            <Card className="transition-shadow hover:shadow-lg">
                                <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
                                    <Image src={article.image} alt={article.title} fill className="object-cover" />
                                </div>
                                <CardHeader>
                                    <Badge variant="secondary" className="mb-2 w-fit">
                                        {article.category}
                                    </Badge>
                                    <CardTitle className="text-lg">{article.title}</CardTitle>
                                    <CardDescription>{article.description}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground">
                                        {article.readTime} • {article.publishedAt}
                                    </p>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    )
}
