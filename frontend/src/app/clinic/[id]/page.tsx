import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { Button } from "@/shared/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card"
import { Badge } from "@/shared/ui/badge"
import { Star, MapPin, Clock, Phone, Globe, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function ClinicDetailPage() {
  const services = [
    { name: "Khám Tổng Quát", price: "500.000đ" },
    { name: "Khám Chuyên Khoa", price: "800.000đ" },
    { name: "Xét Nghiệm", price: "Tùy loại" },
    { name: "Khám Sức Khỏe", price: "1.500.000đ" },
    { name: "Tiêm Chủng", price: "300.000đ" },
    { name: "Thủ Thuật Nhỏ", price: "600.000đ" },
  ]

  const packages = [
    {
      name: "Gói Sức Khỏe Cơ Bản",
      price: "2.000.000đ",
      features: ["Xét nghiệm máu tổng quát", "Đo huyết áp", "Khám tổng quát"],
    },
  ]

  const timeSlots = {
    today: ["10:00", "11:30", "14:00", "16:30"],
    tomorrow: ["9:00", "10:30", "13:00", "15:00", "17:00"],
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <div className="relative h-80 w-full">
          <Image src="/modern-healthcare-clinic-interior-reception.jpg" alt="Phòng Khám Đa Khoa An Khang" fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>

        <div className="container mx-auto px-4">
          <div className="relative -mt-20 mb-8">
            <Card className="shadow-xl">
              <CardHeader>
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="flex-1">
                    <div className="mb-2 flex items-center gap-3">
                      <CardTitle className="text-2xl">Phòng Khám Đa Khoa An Khang</CardTitle>
                      <Badge className="bg-success text-white">
                        <span className="mr-1">●</span> Đang Mở Cửa
                      </Badge>
                    </div>
                    <div className="mb-4 flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                        <span className="text-xl font-semibold">4.8</span>
                      </div>
                      <span className="text-muted-foreground">(256 đánh giá)</span>
                    </div>
                    <p className="text-muted-foreground">
                      Phòng Khám Đa Khoa An Khang là cơ sở y tế hiện đại cung cấp dịch vụ chăm sóc sức khỏe toàn diện.
                      Đội ngũ bác sĩ giàu kinh nghiệm và chuyên môn y tế chuyên nghiệp cam kết mang đến dịch vụ chăm sóc
                      sức khỏe chất lượng trong môi trường thoải mái.
                    </p>
                  </div>
                  <Link href="/booking">
                    <Button size="lg" className="bg-primary">
                      <Clock className="mr-2 h-5 w-5" />
                      Đặt Lịch Khám
                    </Button>
                  </Link>
                </div>
              </CardHeader>
            </Card>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              {/* Contact Information */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Thông Tin Liên Hệ</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="mt-1 h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Địa chỉ</p>
                      <p className="text-muted-foreground">123 Đường Lê Lợi, Quận 1, TP.HCM</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="mt-1 h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Điện thoại</p>
                      <p className="text-muted-foreground">1900 xxxx</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Globe className="mt-1 h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Website</p>
                      <p className="text-muted-foreground">www.phongkhamankang.vn</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="mt-1 h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Giờ làm việc</p>
                      <p className="text-muted-foreground">T2-T7: 8:00 - 20:00</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Services */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Dịch Vụ Cung Cấp</CardTitle>
                  <CardDescription>Các dịch vụ khám và điều trị tại phòng khám</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {services.map((service, index) => (
                      <div key={index} className="flex items-center justify-between rounded-lg border p-3">
                        <span>{service.name}</span>
                        <span className="font-semibold text-primary">{service.price}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Packages */}
              <Card>
                <CardHeader>
                  <CardTitle>Gói Khám Sức Khỏe</CardTitle>
                  <CardDescription>Các gói khám sức khỏe tổng quát</CardDescription>
                </CardHeader>
                <CardContent>
                  {packages.map((pkg, index) => (
                    <Card key={index} className="border-primary/20">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{pkg.name}</CardTitle>
                          <span className="text-xl font-bold text-primary">{pkg.price}</span>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {pkg.features.map((feature, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-success" />
                              <span className="text-sm">{feature}</span>
                            </li>
                          ))}
                        </ul>
                        <Link href="/booking" className="mt-4 block">
                          <Button className="w-full bg-primary">Đặt Ngay</Button>
                        </Link>
                      </CardContent>
                    </Card>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar - Available Times */}
            <div>
              <Card className="sticky top-20">
                <CardHeader>
                  <CardTitle>Khung Giờ Còn Trống</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="mb-3 font-semibold">Hôm nay</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {timeSlots.today.map((time) => (
                        <Button
                          key={time}
                          variant="outline"
                          className="hover:border-primary hover:bg-primary/5 bg-transparent"
                        >
                          {time}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-3 font-semibold">Ngày mai</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {timeSlots.tomorrow.map((time) => (
                        <Button
                          key={time}
                          variant="outline"
                          className="hover:border-primary hover:bg-primary/5 bg-transparent"
                        >
                          {time}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-3 font-semibold">T2, 30/12</h3>
                    <div className="grid grid-cols-2 gap-2">
                      <Button variant="outline" className="hover:border-primary hover:bg-primary/5 bg-transparent">
                        9:30
                      </Button>
                      <Button variant="outline" className="hover:border-primary hover:bg-primary/5 bg-transparent">
                        11:00
                      </Button>
                      <Button variant="outline" className="hover:border-primary hover:bg-primary/5 bg-transparent">
                        14:30
                      </Button>
                      <Button variant="outline" className="hover:border-primary hover:bg-primary/5 bg-transparent">
                        16:00
                      </Button>
                    </div>
                  </div>

                  <Link href="/booking">
                    <Button className="w-full bg-primary" size="lg">
                      Xem Thêm Lịch Trống
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
