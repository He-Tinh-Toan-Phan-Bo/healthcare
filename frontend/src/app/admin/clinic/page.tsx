"use client"

import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card"
import { Button } from "@/shared/ui/button"
import { Badge } from "@/shared/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs"
import { Calendar, Users, Clock, Star, Settings } from "lucide-react"

export default function ClinicAdminPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 bg-muted/30">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="mb-2 text-3xl font-bold">Quản Lý Phòng Khám</h1>
                <p className="text-muted-foreground">Phòng Khám Đa Khoa An Khang</p>
              </div>
              <Button variant="outline" className="gap-2 bg-transparent">
                <Settings className="h-4 w-4" />
                Cài Đặt
              </Button>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Lịch Hẹn Hôm Nay</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24</div>
                <p className="text-xs text-muted-foreground">6 đang chờ, 18 đã xác nhận</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Bệnh Nhân Mới</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">142</div>
                <p className="text-xs text-success">+23% so với tháng trước</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Thời Gian Chờ TB</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">15 phút</div>
                <p className="text-xs text-success">-5 phút so với trước</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Đánh Giá</CardTitle>
                <Star className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4.8/5</div>
                <p className="text-xs text-muted-foreground">256 đánh giá</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <Tabs defaultValue="appointments" className="space-y-6">
            <TabsList>
              <TabsTrigger value="appointments">Lịch Hẹn</TabsTrigger>
              <TabsTrigger value="patients">Bệnh Nhân</TabsTrigger>
              <TabsTrigger value="services">Dịch Vụ</TabsTrigger>
              <TabsTrigger value="schedule">Lịch Làm Việc</TabsTrigger>
            </TabsList>

            {/* Appointments Tab */}
            <TabsContent value="appointments" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Lịch Hẹn Hôm Nay</CardTitle>
                  <CardDescription>Quản lý các lịch hẹn của ngày hôm nay</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { time: "10:00", patient: "Nguyễn Thị Lan", service: "Khám Tổng Quát", status: "confirmed" },
                      { time: "14:00", patient: "Trần Văn Minh", service: "Khám Chuyên Khoa", status: "pending" },
                      { time: "16:00", patient: "Lê Thị Hương", service: "Xét Nghiệm", status: "confirmed" },
                    ].map((appointment, idx) => (
                      <div key={idx} className="flex items-center justify-between rounded-lg border p-4">
                        <div className="flex items-center gap-4">
                          <div className="text-center">
                            <p className="text-lg font-bold">{appointment.time}</p>
                          </div>
                          <div>
                            <p className="font-medium">{appointment.patient}</p>
                            <p className="text-sm text-muted-foreground">{appointment.service}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge variant={appointment.status === "confirmed" ? "default" : "secondary"}>
                            {appointment.status === "confirmed" ? "Đã Xác Nhận" : "Chờ Xác Nhận"}
                          </Badge>
                          <Button size="sm" variant="outline">
                            Chi Tiết
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Patients Tab */}
            <TabsContent value="patients" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Danh Sách Bệnh Nhân</CardTitle>
                  <CardDescription>Hồ sơ bệnh nhân của phòng khám</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    Chức năng quản lý bệnh nhân đang được phát triển...
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Services Tab */}
            <TabsContent value="services" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Dịch Vụ & Giá</CardTitle>
                  <CardDescription>Quản lý dịch vụ và bảng giá phòng khám</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { name: "Khám Tổng Quát", price: "500.000đ", bookings: 45 },
                      { name: "Xét Nghiệm", price: "Tùy loại", bookings: 32 },
                      { name: "Khám Sức Khỏe", price: "1.500.000đ", bookings: 18 },
                    ].map((service, idx) => (
                      <div key={idx} className="flex items-center justify-between rounded-lg border p-4">
                        <div>
                          <p className="font-medium">{service.name}</p>
                          <p className="text-sm text-muted-foreground">{service.bookings} lượt đặt tháng này</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-semibold text-primary">{service.price}</span>
                          <Button size="sm" variant="outline">
                            Chỉnh Sửa
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Schedule Tab */}
            <TabsContent value="schedule" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Lịch Làm Việc</CardTitle>
                  <CardDescription>Cài đặt giờ làm việc và khung giờ khám</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    Chức năng cài đặt lịch làm việc đang được phát triển...
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  )
}
