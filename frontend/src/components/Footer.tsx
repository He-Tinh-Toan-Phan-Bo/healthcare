"use client"

import Link from "next/link"
import { Calendar, Phone, Mail, MapPin } from "lucide-react"
import { useTranslation } from "react-i18next"
import { ROUTES } from "@/shared/constants"

export function Footer() {
  const { t } = useTranslation("home")
  const { t: tn } = useTranslation("nav")
  const { t: tc } = useTranslation("common")

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
              {t("footer.desc")}
            </p>
          </div>

          <div>
            <h3 className="mb-4 font-semibold">{tc("services")}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href={ROUTES.CLINICS} className="text-muted-foreground hover:text-primary">
                  {tn("clinics")}
                </Link>
              </li>
              <li>
                <Link href={ROUTES.PACKAGES} className="text-muted-foreground hover:text-primary">
                  {tn("packages")}
                </Link>
              </li>
              <li>
                <Link href={ROUTES.BOOKING} className="text-muted-foreground hover:text-primary">
                  {tc("book_appointment")}
                </Link>
              </li>
              <li>
                <Link href={ROUTES.HEALTH_GUIDE} className="text-muted-foreground hover:text-primary">
                  {tn("health_guide")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-semibold">{tc("about_us")}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href={ROUTES.ABOUT} className="text-muted-foreground hover:text-primary">
                  {tn("about")}
                </Link>
              </li>
              <li>
                <Link href={ROUTES.ACCOUNT} className="text-muted-foreground hover:text-primary">
                  {tc("account")}
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-primary">
                  {tc("privacy_policy")}
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-primary">
                  {tc("terms")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-semibold">{tc("contact")}</h3>
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
          <p>&copy; {tc("copyright")}</p>
        </div>
      </div>
    </footer>
  )
}
