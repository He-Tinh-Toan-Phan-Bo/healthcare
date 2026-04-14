"use client"

import Link from "next/link"
import { Button } from "@/shared/ui/button"
import { LanguageSwitcher } from "@/components/LanguageSwitcher"
import { useLanguage } from "@/shared/provider/LanguageProvider"
import { Logo } from "@/components/Logo"

export function Header() {
  const { t } = useLanguage()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white shadow-md">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <Link href="/clinics" className="text-sm font-medium text-foreground/80 transition-colors hover:text-primary">
            {t("Phòng Khám", "Clinics")}
          </Link>
          <Link
            href="/#packages"
            className="text-sm font-medium text-foreground/80 transition-colors hover:text-primary"
          >
            {t("Gói Khám Sức Khỏe", "Health Packages")}
          </Link>
          <Link href="/about" className="text-sm font-medium text-foreground/80 transition-colors hover:text-primary">
            {t("Về Chúng Tôi", "About Us")}
          </Link>
          <Link
            href="/health-guide"
            className="text-sm font-medium text-foreground/80 transition-colors hover:text-primary"
          >
            {t("Cẩm Nang Sức Khỏe", "Health Guide")}
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <Link href="/login">
            <Button variant="ghost" size="sm">
              {t("Đăng Nhập", "Login")}
            </Button>
          </Link>
          <Link href="/booking">
            <Button size="sm" className="bg-primary text-white hover:bg-primary/90">
              {t("Đặt Lịch Khám", "Book Appointment")}
            </Button>
          </Link>
        </div>
      </div>
    </header>
  )
}
