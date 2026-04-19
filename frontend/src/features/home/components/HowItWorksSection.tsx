"use client"

import { HOME_TEXTS } from "@/shared/constants/home"
import { useLanguage } from "@/shared/provider/LanguageProvider"

export function HowItWorksSection() {
    const { t } = useLanguage()
    return (
        <section className="bg-muted/30 py-12 md:py-16">
            <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mb-8 text-center md:mb-12">
                    <h2 className="mb-3 text-2xl font-bold sm:text-3xl md:mb-4">{t(HOME_TEXTS.HOW_IT_WORKS.TITLE.vi, HOME_TEXTS.HOW_IT_WORKS.TITLE.en)}</h2>
                    <p className="text-sm text-muted-foreground sm:text-base">{t(HOME_TEXTS.HOW_IT_WORKS.DESC.vi, HOME_TEXTS.HOW_IT_WORKS.DESC.en)}</p>
                </div>

                <div className="grid gap-8 sm:grid-cols-3">
                    <div className="text-center">
                        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-xl font-bold text-white sm:h-16 sm:w-16 sm:text-2xl">
                            1
                        </div>
                        <h3 className="mb-2 text-lg font-semibold sm:text-xl">{t(HOME_TEXTS.HOW_IT_WORKS.STEP_1_TITLE.vi, HOME_TEXTS.HOW_IT_WORKS.STEP_1_TITLE.en)}</h3>
                        <p className="text-sm text-muted-foreground">{t(HOME_TEXTS.HOW_IT_WORKS.STEP_1_DESC.vi, HOME_TEXTS.HOW_IT_WORKS.STEP_1_DESC.en)}</p>
                    </div>

                    <div className="text-center">
                        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-xl font-bold text-white sm:h-16 sm:w-16 sm:text-2xl">
                            2
                        </div>
                        <h3 className="mb-2 text-lg font-semibold sm:text-xl">{t(HOME_TEXTS.HOW_IT_WORKS.STEP_2_TITLE.vi, HOME_TEXTS.HOW_IT_WORKS.STEP_2_TITLE.en)}</h3>
                        <p className="text-sm text-muted-foreground">{t(HOME_TEXTS.HOW_IT_WORKS.STEP_2_DESC.vi, HOME_TEXTS.HOW_IT_WORKS.STEP_2_DESC.en)}</p>
                    </div>

                    <div className="text-center">
                        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-xl font-bold text-white sm:h-16 sm:w-16 sm:text-2xl">
                            3
                        </div>
                        <h3 className="mb-2 text-lg font-semibold sm:text-xl">{t(HOME_TEXTS.HOW_IT_WORKS.STEP_3_TITLE.vi, HOME_TEXTS.HOW_IT_WORKS.STEP_3_TITLE.en)}</h3>
                        <p className="text-sm text-muted-foreground">{t(HOME_TEXTS.HOW_IT_WORKS.STEP_3_DESC.vi, HOME_TEXTS.HOW_IT_WORKS.STEP_3_DESC.en)}</p>
                    </div>
                </div>
            </div>
        </section>
    )
}
