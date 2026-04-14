"use client"

import { useState } from "react"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { Button } from "@/shared/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card"
import { Badge } from "@/shared/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs"
import { Calendar, Clock, Bell, User } from "lucide-react"

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState("appointments")

  const appointments = [
    {
      id: 1,
      clinic: "Phòng Khám Đa Khoa An Khang",
      service: "Khám Tổng Quát",
      date: "28 Th12, 2025",
      time: "10:00",
      doctor: "BS. Nguyễn Thị Lan",
      status: "upcoming",
    },
    {
      id: 2,
      clinic: "Nha Khoa Thành Phố",
      service: "Khám Nha Khoa",
      date: "05 Th1, 2026",
      time: "14:00",
      doctor: "BS. Trần Văn Minh",
      status: "upcoming",
    },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 bg-muted/30 py-12">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="mb-2 text-3xl font-bold">Tài Khoản Của Tôi</h1>
            <p className="text-muted-foreground">Quản lý lịch hẹn và thông tin cá nhân</p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
              <TabsTrigger value="appointments">
                <Calendar className="mr-2 h-4 w-4" />
                Lịch Hẹn
              </TabsTrigger>
              <TabsTrigger value="profile">
                <User className="mr-2 h-4 w-4" />
                Hồ Sơ
              </TabsTrigger>
              <TabsTrigger value="notifications">
                <Bell className="mr-2 h-4 w-4" />
                Thông Báo
              </TabsTrigger>
            </TabsList>

            {/* Appointments Tab */}
            <TabsContent value="appointments" className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Lịch Hẹn Của Tôi</h2>
                <Button className="bg-primary">Đặt Lịch Mới</Button>
              </div>

              {appointments.map((appointment) => (
                <Card key={appointment.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{appointment.clinic}</CardTitle>
                        <Badge className="mt-2 bg-success text-white">Sắp Tới</Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="font-medium">{appointment.service}</p>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{appointment.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{appointment.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span>{appointment.doctor}</span>
                      </div>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button variant="outline" className="flex-1 bg-transparent">
                        Đổi Lịch
                      </Button>
                      <Button variant="destructive" className="flex-1">
                        Hủy
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            {/* Profile Tab */}
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Thông Tin Cá Nhân</CardTitle>
                  <CardDescription>Cập nhật thông tin của bạn</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <p className="mb-1 text-sm font-medium">Họ và Tên</p>
                      <p className="text-muted-foreground">Nguyễn Văn A</p>
                    </div>
                    <div>
                      <p className="mb-1 text-sm font-medium">Email</p>
                      <p className="text-muted-foreground">nguyenvana@example.com</p>
                    </div>
                    <div>
                      <p className="mb-1 text-sm font-medium">Số Điện Thoại</p>
                      <p className="text-muted-foreground">0912345678</p>
                    </div>
                    <div>
                      <p className="mb-1 text-sm font-medium">Ngày Sinh</p>
                      <p className="text-muted-foreground">01/01/1990</p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="mb-1 text-sm font-medium">Địa Chỉ</p>
                      <p className="text-muted-foreground">123 Đường ABC, Quận 1, TP.HCM</p>
                    </div>
                  </div>
                  <Button className="mt-4 bg-primary">Chỉnh Sửa Thông Tin</Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Notifications Tab */}
            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle>Thông Báo</CardTitle>
                  <CardDescription>Các thông báo và cập nhật mới nhất</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-lg border p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <p className="font-medium">Nhắc nhở lịch hẹn</p>
                      <span className="text-xs text-muted-foreground">2 giờ trước</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Bạn có lịch khám tại Phòng Khám Đa Khoa An Khang vào ngày 28/12 lúc 10:00
                    </p>
                  </div>
                  <div className="rounded-lg border p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <p className="font-medium">Xác nhận đặt lịch</p>
                      <span className="text-xs text-muted-foreground">1 ngày trước</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Lịch khám của bạn đã được xác nhận thành công</p>
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
