import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card"
import { Award, Heart, Shield, Users } from "lucide-react"
import Image from "next/image"

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-blue-50 via-white to-teal-50 py-8 md:py-12">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="mb-4 text-2xl font-bold leading-tight text-balance sm:text-3xl lg:text-4xl">Về HealthCare</h1>
              <p className="text-base text-muted-foreground text-pretty sm:text-lg">
                Chúng tôi cam kết mang đến dịch vụ đặt lịch khám phòng khám tiện lợi và chất lượng cao nhất cho cộng
                đồng.
              </p>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-8 md:py-12">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-2 items-center">
              <div>
                <h2 className="mb-6 text-3xl font-bold">Sứ Mệnh Của Chúng Tôi</h2>
                <p className="mb-4 text-muted-foreground leading-relaxed">
                  HealthCare được thành lập với mục tiêu giúp mọi người dễ dàng tiếp cận các dịch vụ y tế chất lượng
                  cao. Chúng tôi hiểu rằng việc đặt lịch khám bệnh thường gặp nhiều khó khăn và mất thời gian.
                </p>
                <p className="mb-4 text-muted-foreground leading-relaxed">
                  Với nền tảng công nghệ hiện đại, chúng tôi kết nối bệnh nhân với các phòng khám uy tín, giúp quá trình
                  đặt lịch trở nên nhanh chóng, tiện lợi và minh bạch.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Sứ mệnh của chúng tôi là cải thiện trải nghiệm chăm sóc sức khỏe, giúp mọi người chủ động hơn trong
                  việc quản lý sức khỏe của bản thân và gia đình.
                </p>
              </div>
              <div className="relative h-96 rounded-2xl overflow-hidden">
                <Image src="/modern-healthcare-team-professional.jpg" alt="Healthcare Team" fill className="object-cover" />
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="bg-muted/30 py-8 md:py-12">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8 text-center">
              <h2 className="mb-3 text-2xl font-bold sm:text-3xl">Giá Trị Cốt Lõi</h2>
              <p className="text-muted-foreground">Những giá trị định hướng mọi hoạt động của chúng tôi</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader>
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Heart className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Tận Tâm</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Chúng tôi đặt sức khỏe và sự hài lòng của bệnh nhân lên hàng đầu trong mọi quyết định.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-secondary/10">
                    <Shield className="h-6 w-6 text-secondary" />
                  </div>
                  <CardTitle>Uy Tín</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Chỉ hợp tác với các phòng khám được kiểm định chất lượng và có giấy phép hoạt động hợp pháp.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Tiện Lợi</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Nền tảng dễ sử dụng, đặt lịch nhanh chóng chỉ trong vài phút, mọi lúc mọi nơi.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-secondary/10">
                    <Award className="h-6 w-6 text-secondary" />
                  </div>
                  <CardTitle>Chất Lượng</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Cam kết cung cấp dịch vụ tốt nhất với đội ngũ hỗ trợ chuyên nghiệp và tận tình.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid gap-8 md:grid-cols-3">
              <div className="text-center">
                <div className="mb-2 text-4xl font-bold text-primary">500+</div>
                <p className="text-muted-foreground">Phòng Khám Đối Tác</p>
              </div>
              <div className="text-center">
                <div className="mb-2 text-4xl font-bold text-primary">50,000+</div>
                <p className="text-muted-foreground">Lượt Đặt Lịch Thành Công</p>
              </div>
              <div className="text-center">
                <div className="mb-2 text-4xl font-bold text-primary">4.8/5</div>
                <p className="text-muted-foreground">Đánh Giá Trung Bình</p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="bg-muted/30 py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="mb-4 text-3xl font-bold">Liên Hệ Với Chúng Tôi</h2>
              <p className="mb-6 text-muted-foreground">
                Bạn có câu hỏi hoặc cần hỗ trợ? Đội ngũ của chúng tôi luôn sẵn sàng giúp đỡ.
              </p>
              <div className="space-y-2 text-muted-foreground">
                <p>Email: support@healthcare.vn</p>
                <p>Hotline: 1900 xxxx</p>
                <p>Giờ làm việc: T2-T7, 8:00 - 20:00</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
