"use client"

import Link from "next/link"
import { Button } from "@/shared/ui/button"
import { LanguageSwitcher } from "@/components/LanguageSwitcher"
import { useLanguage } from "@/shared/provider/LanguageProvider"
import { Logo } from "@/components/Logo"
import { useAuthStore } from "@/store"
import { HOME_TEXTS } from "@/shared/constants/home"
import { ROUTES } from "@/shared/constants"

export function Header() {
  const { t } = useLanguage()
  const auth = useAuthStore()
  const rawRole = String(auth.user?.role || "").toUpperCase()
  const role = rawRole === "SUPER_ADMIN" ? "ADMIN" : rawRole
  const canAccessAdmin = role === "ADMIN" || role === "DOCTOR"

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white shadow-md">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <Link href={ROUTES.CLINICS} className="text-sm font-medium text-foreground/80 transition-colors hover:text-primary">
            {t(HOME_TEXTS.HEADER.CLINICS.vi, HOME_TEXTS.HEADER.CLINICS.en)}
          </Link>
          <Link
            href={ROUTES.PACKAGES}
            className="text-sm font-medium text-foreground/80 transition-colors hover:text-primary"
          >
            {t(HOME_TEXTS.HEADER.PACKAGES.vi, HOME_TEXTS.HEADER.PACKAGES.en)}
          </Link>
          <Link href={ROUTES.DOCTORS} className="text-sm font-medium text-foreground/80 transition-colors hover:text-primary">
            {t(HOME_TEXTS.HEADER.DOCTORS.vi, HOME_TEXTS.HEADER.DOCTORS.en)}
          </Link>
          <Link
            href={ROUTES.HEALTH_GUIDE}
            className="text-sm font-medium text-foreground/80 transition-colors hover:text-primary"
          >
            {t(HOME_TEXTS.HEADER.GUIDE.vi, HOME_TEXTS.HEADER.GUIDE.en)}
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          {auth.isAuthenticated ? (
            <Link href="/account">
              <Button variant="ghost" size="sm">
                {t(HOME_TEXTS.COMMON.ACCOUNT.vi, HOME_TEXTS.COMMON.ACCOUNT.en)}
              </Button>
            </Link>
          ) : (
            <Link href="/login">
              <Button variant="ghost" size="sm">
                {t(HOME_TEXTS.COMMON.LOGIN.vi, HOME_TEXTS.COMMON.LOGIN.en)}
              </Button>
            </Link>
          )}
          {canAccessAdmin ? (
            <Link href="/admin">
              <Button variant="outline" size="sm">
                Admin
              </Button>
            </Link>
          ) : null}
          <Link href="/booking">
            <Button size="sm" className="bg-primary text-white hover:bg-primary/90">
              {t(HOME_TEXTS.COMMON.BOOK_APPOINTMENT.vi, HOME_TEXTS.COMMON.BOOK_APPOINTMENT.en)}
            </Button>
          </Link>
        </div>
      </div>
    </header>
  )
}
