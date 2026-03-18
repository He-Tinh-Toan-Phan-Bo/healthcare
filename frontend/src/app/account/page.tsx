"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { Button } from "@/shared/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card"
import { Badge } from "@/shared/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs"
import { Calendar, Clock, Bell, User } from "lucide-react"
import { useAuthStore } from "@/store"
import { useQuery } from "@tanstack/react-query"
import { getMe } from "@/api/auth"
import { getMyBookings } from "@/api/bookings"
import Link from "next/link"

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState("appointments")
  const auth = useAuthStore()

  const meQuery = useQuery({
    queryKey: ["me"],
    enabled: auth.isAuthenticated,
    queryFn: getMe,
  })

  const myBookingsQuery = useQuery({
    queryKey: ["myBookings"],
    enabled: auth.isAuthenticated,
    queryFn: getMyBookings,
  })

  useEffect(() => {
    if (meQuery.data) auth.setUser(meQuery.data)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meQuery.data])

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
                <Link href="/booking">
                  <Button className="bg-primary">Đặt Lịch Mới</Button>
                </Link>
              </div>

              {!auth.isAuthenticated ? (
                <Card>
                  <CardContent className="py-8 text-center">
                    <div className="mb-2 text-sm text-muted-foreground">Bạn chưa đăng nhập.</div>
                    <Link href="/login">
                      <Button className="bg-primary">Đăng Nhập</Button>
                    </Link>
                  </CardContent>
                </Card>
              ) : myBookingsQuery.isLoading ? (
                <Card>
                  <CardContent className="py-8 text-center text-sm text-muted-foreground">
                    Đang tải lịch hẹn...
                  </CardContent>
                </Card>
              ) : (
                (myBookingsQuery.data?.items ?? []).map((b: any) => (
                  <Card key={b.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{b.clinic?.name ?? "Phòng khám"}</CardTitle>
                          <Badge className="mt-2 bg-success text-white">{String(b.status)}</Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex flex-wrap gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>{String(b.bookingDate).slice(0, 10)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>{b.bookingTime}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span>{b.doctor?.name ?? "—"}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
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
                      <p className="text-muted-foreground">{auth.user?.name ?? "—"}</p>
                    </div>
                    <div>
                      <p className="mb-1 text-sm font-medium">Email</p>
                      <p className="text-muted-foreground">{auth.user?.email ?? "—"}</p>
                    </div>
                    <div>
                      <p className="mb-1 text-sm font-medium">Số Điện Thoại</p>
                      <p className="text-muted-foreground">{auth.user?.phone ?? "—"}</p>
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
                  <Button className="mt-4 bg-primary" disabled>
                    Chỉnh Sửa Thông Tin
                  </Button>
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
