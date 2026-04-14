"use client"

import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card"
import { Button } from "@/shared/ui/button"
import { Badge } from "@/shared/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs"
import { Users, Building2, Calendar, DollarSign } from "lucide-react"

export default function WebsiteAdminPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 bg-muted/30">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="mb-2 text-3xl font-bold">Trang Quản Trị Website</h1>
            <p className="text-muted-foreground">Quản lý hệ thống, phòng khám và người dùng</p>
          </div>

          {/* Stats Overview */}
          <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Tổng Người Dùng</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12,543</div>
                <p className="text-xs text-success">+12.5% so với tháng trước</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Phòng Khám</CardTitle>
                <Building2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">523</div>
                <p className="text-xs text-success">+8 phòng khám mới</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Lượt Đặt Lịch</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8,234</div>
                <p className="text-xs text-success">+18.2% so với tháng trước</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Doanh Thu</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2.5B VND</div>
                <p className="text-xs text-success">+15.3% so với tháng trước</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <Tabs defaultValue="clinics" className="space-y-6">
            <TabsList>
              <TabsTrigger value="clinics">Phòng Khám</TabsTrigger>
              <TabsTrigger value="users">Người Dùng</TabsTrigger>
              <TabsTrigger value="bookings">Lịch Hẹn</TabsTrigger>
              <TabsTrigger value="analytics">Thống Kê</TabsTrigger>
            </TabsList>

            {/* Clinics Tab */}
            <TabsContent value="clinics" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Danh Sách Phòng Khám</CardTitle>
                  <CardDescription>Quản lý tất cả phòng khám trên hệ thống</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { name: "Phòng Khám Đa Khoa An Khang", status: "active", bookings: 523 },
                      { name: "Nha Khoa Thành Phố", status: "active", bookings: 412 },
                      { name: "Phòng Khám Gia Đình", status: "pending", bookings: 89 },
                    ].map((clinic, idx) => (
                      <div key={idx} className="flex items-center justify-between rounded-lg border p-4">
                        <div>
                          <p className="font-medium">{clinic.name}</p>
                          <p className="text-sm text-muted-foreground">{clinic.bookings} lượt đặt lịch</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge variant={clinic.status === "active" ? "default" : "secondary"}>
                            {clinic.status === "active" ? "Hoạt Động" : "Chờ Duyệt"}
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

            {/* Users Tab */}
            <TabsContent value="users" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Quản Lý Người Dùng</CardTitle>
                  <CardDescription>Danh sách người dùng đã đăng ký</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { name: "Nguyễn Văn A", email: "nguyenvana@email.com", bookings: 5 },
                      { name: "Trần Thị B", email: "tranthib@email.com", bookings: 3 },
                      { name: "Lê Văn C", email: "levanc@email.com", bookings: 8 },
                    ].map((user, idx) => (
                      <div key={idx} className="flex items-center justify-between rounded-lg border p-4">
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-muted-foreground">{user.bookings} lượt đặt</span>
                          <Button size="sm" variant="outline">
                            Xem
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Bookings Tab */}
            <TabsContent value="bookings" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Quản Lý Lịch Hẹn</CardTitle>
                  <CardDescription>Theo dõi tất cả lịch hẹn trên hệ thống</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    Chức năng quản lý lịch hẹn đang được phát triển...
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Thống Kê & Báo Cáo</CardTitle>
                  <CardDescription>Phân tích dữ liệu và xu hướng</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">Biểu đồ thống kê đang được phát triển...</div>
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
