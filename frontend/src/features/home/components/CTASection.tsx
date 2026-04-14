import { Button } from "@/shared/ui/button"
import Link from "next/link"
import { ROUTES } from "@/shared/constants"

export function CTASection() {
    return (
        <section className="bg-gradient-to-r from-primary to-secondary py-12 text-white md:py-16">
            <div className="container mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
                <h2 className="mb-3 text-2xl font-bold text-balance sm:text-3xl md:mb-4">Sẵn sàng đặt lịch khám?</h2>
                <p className="mb-6 text-base text-white/90 text-pretty sm:text-lg md:mb-8">
                    Bắt đầu chăm sóc sức khỏe của bạn ngay hôm nay
                </p>
                <div className="flex flex-col justify-center gap-3 sm:flex-row sm:gap-4">
                    <Link href={ROUTES.BOOKING} className="w-full sm:w-auto">
                        <Button size="lg" variant="secondary" className="w-full bg-white text-primary hover:bg-white/90 sm:w-auto">
                            Đặt Lịch Ngay
                        </Button>
                    </Link>
                    <Link href="/#clinics" className="w-full sm:w-auto">
                        <Button
                            size="lg"
                            variant="outline"
                            className="w-full border-white bg-transparent text-white hover:bg-white/10 sm:w-auto"
                        >
                            Xem Phòng Khám
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    )
}
