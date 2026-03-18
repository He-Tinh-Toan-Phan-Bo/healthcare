"use client"

import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { Button } from "@/shared/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card"
import { Badge } from "@/shared/ui/badge"
import { Star, MapPin, Clock, Phone, Globe, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useParams } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { getClinicById } from "@/api/clinics"

export default function ClinicDetailPage() {
  const params = useParams<{ id: string }>()
  const id = params?.id

  const { data: clinic, isLoading } = useQuery({
    queryKey: ["clinic", id],
    enabled: !!id,
    queryFn: () => getClinicById(String(id)),
  })

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <div className="relative h-80 w-full">
          <Image
            src={clinic?.image || "/modern-healthcare-clinic-interior-reception.jpg"}
            alt={clinic?.name || "Clinic"}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>

        <div className="container mx-auto px-4">
          <div className="relative -mt-20 mb-8">
            <Card className="shadow-xl">
              <CardHeader>
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="flex-1">
                    <div className="mb-2 flex items-center gap-3">
                      <CardTitle className="text-2xl">{clinic?.name ?? (isLoading ? "Đang tải..." : "Không tìm thấy")}</CardTitle>
                      <Badge className="bg-success text-white">
                        <span className="mr-1">●</span> Đang Mở Cửa
                      </Badge>
                    </div>
                    <div className="mb-4 flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                        <span className="text-xl font-semibold">{clinic?.rating ?? 0}</span>
                      </div>
                      <span className="text-muted-foreground">({clinic?.reviewCount ?? 0} đánh giá)</span>
                    </div>
                    <p className="text-muted-foreground">
                      {clinic?.description ||
                        "Phòng khám cung cấp các dịch vụ chăm sóc sức khỏe chất lượng, đội ngũ bác sĩ giàu kinh nghiệm."}
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
                      <p className="text-muted-foreground">{clinic?.address || "—"}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="mt-1 h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Điện thoại</p>
                      <p className="text-muted-foreground">{clinic?.phone || "—"}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Globe className="mt-1 h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Website</p>
                      <p className="text-muted-foreground">{clinic?.website || "—"}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="mt-1 h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Giờ làm việc</p>
                      <p className="text-muted-foreground">{clinic?.openingHours || "—"}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Doctors */}
              <Card>
                <CardHeader>
                  <CardTitle>Bác Sĩ</CardTitle>
                  <CardDescription>Danh sách bác sĩ tại phòng khám</CardDescription>
                </CardHeader>
                <CardContent>
                  {!clinic?.doctors?.length ? (
                    <div className="text-sm text-muted-foreground">Chưa có dữ liệu bác sĩ.</div>
                  ) : (
                    <div className="grid gap-4 sm:grid-cols-2">
                      {clinic.doctors.map((d) => (
                        <div key={d.id} className="rounded-lg border p-3">
                          <div className="font-medium">{d.name}</div>
                          <div className="text-sm text-muted-foreground">{d.specialty.name}</div>
                          <div className="mt-1 text-sm text-muted-foreground">Kinh nghiệm: {d.experience} năm</div>
                        </div>
                      ))}
                    </div>
                  )}
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
                      {["10:00", "11:30", "14:00", "16:30"].map((time) => (
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
                      {["9:00", "10:30", "13:00", "15:00", "17:00"].map((time) => (
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
