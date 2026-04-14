import Link from "next/link"
import { Calendar, Phone, Mail, MapPin } from "lucide-react"

export function Footer() {
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
              Đặt lịch khám uy tín, nhanh chóng và tiện lợi
            </p>
          </div>

          <div>
            <h3 className="mb-4 font-semibold">Dịch Vụ</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-primary">
                  Phòng Khám
                </Link>
              </li>
              <li>
                <Link href="/#packages" className="text-muted-foreground hover:text-primary">
                  Gói Khám Sức Khỏe
                </Link>
              </li>
              <li>
                <Link href="/booking" className="text-muted-foreground hover:text-primary">
                  Đặt Lịch Khám
                </Link>
              </li>
              <li>
                <Link href="/health-guide" className="text-muted-foreground hover:text-primary">
                  Cẩm Nang Sức Khỏe
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-semibold">Về Chúng Tôi</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/#about" className="text-muted-foreground hover:text-primary">
                  Giới Thiệu
                </Link>
              </li>
              <li>
                <Link href="/account" className="text-muted-foreground hover:text-primary">
                  Tài Khoản
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-primary">
                  Chính Sách Bảo Mật
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-primary">
                  Điều Khoản Dịch Vụ
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-semibold">Liên Hệ</h3>
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
          <p>&copy; 2025 Đặt Lịch Phòng Khám. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
