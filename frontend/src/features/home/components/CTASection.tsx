"use client"

import { Button } from "@/shared/ui/button"
import Link from "next/link"
import { ROUTES } from "@/shared/constants"
import { useTranslation } from "react-i18next"

export function CTASection() {
    const { t } = useTranslation("home")
    return (
        <section className="bg-gradient-to-r from-primary to-secondary py-12 text-white md:py-16">
            <div className="container mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
                <h2 className="mb-3 text-2xl font-bold text-balance sm:text-3xl md:mb-4">{t("cta.title")}</h2>
                <p className="mb-6 text-base text-white/90 text-pretty sm:text-lg md:mb-8">
                    {t("cta.desc")}
                </p>
                <div className="flex flex-col justify-center gap-3 sm:flex-row sm:gap-4">
                    <Link href={ROUTES.CLINICS} className="w-full sm:w-auto">
                        <Button size="lg" variant="secondary" className="w-full bg-white text-primary hover:bg-white/90 sm:w-auto">
                            {t("cta.button_primary")}
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    )
}
