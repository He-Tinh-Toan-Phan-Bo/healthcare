"use client"

import Link from "next/link"
import { Calendar, Phone, Mail, MapPin } from "lucide-react"
import { useLanguage } from "@/shared/provider/LanguageProvider"
import { HOME_TEXTS } from "@/shared/constants/home"
import { ROUTES } from "@/shared/constants"

export function Footer() {
  const { t } = useLanguage()
  return (
    <footer className="border-t bg-muted/30">
      <div className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Calendar className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold">HealthCare</span>
            </div>
            <p className="text-sm text-muted-foreground">
              {t(HOME_TEXTS.FOOTER.DESC.vi, HOME_TEXTS.FOOTER.DESC.en)}
            </p>
          </div>

          <div>
            <h3 className="mb-4 font-semibold">{t(HOME_TEXTS.COMMON.SERVICES.vi, HOME_TEXTS.COMMON.SERVICES.en)}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href={ROUTES.CLINICS} className="text-muted-foreground hover:text-primary">
                  {t(HOME_TEXTS.HEADER.CLINICS.vi, HOME_TEXTS.HEADER.CLINICS.en)}
                </Link>
              </li>
              <li>
                <Link href={ROUTES.PACKAGES} className="text-muted-foreground hover:text-primary">
                  {t(HOME_TEXTS.HEADER.PACKAGES.vi, HOME_TEXTS.HEADER.PACKAGES.en)}
                </Link>
              </li>
              <li>
                <Link href={ROUTES.BOOKING} className="text-muted-foreground hover:text-primary">
                  {t(HOME_TEXTS.COMMON.BOOK_APPOINTMENT.vi, HOME_TEXTS.COMMON.BOOK_APPOINTMENT.en)}
                </Link>
              </li>
              <li>
                <Link href={ROUTES.HEALTH_GUIDE} className="text-muted-foreground hover:text-primary">
                  {t(HOME_TEXTS.HEADER.GUIDE.vi, HOME_TEXTS.HEADER.GUIDE.en)}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-semibold">{t(HOME_TEXTS.COMMON.ABOUT_US.vi, HOME_TEXTS.COMMON.ABOUT_US.en)}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href={ROUTES.ABOUT} className="text-muted-foreground hover:text-primary">
                  {t("Giới Thiệu", "About Us")}
                </Link>
              </li>
              <li>
                <Link href={ROUTES.ACCOUNT} className="text-muted-foreground hover:text-primary">
                  {t(HOME_TEXTS.COMMON.ACCOUNT.vi, HOME_TEXTS.COMMON.ACCOUNT.en)}
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-primary">
                  {t(HOME_TEXTS.COMMON.PRIVACY_POLICY.vi, HOME_TEXTS.COMMON.PRIVACY_POLICY.en)}
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-primary">
                  {t(HOME_TEXTS.COMMON.TERMS.vi, HOME_TEXTS.COMMON.TERMS.en)}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-semibold">{t(HOME_TEXTS.COMMON.CONTACT.vi, HOME_TEXTS.COMMON.CONTACT.en)}</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>0914446628</span>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>leevanphu2905@gmail.com</span>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>Hồ Chí Minh, Việt Nam</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {t(HOME_TEXTS.COMMON.COPYRIGHT.vi, HOME_TEXTS.COMMON.COPYRIGHT.en)}</p>
        </div>
      </div>
    </footer>
  )
}
