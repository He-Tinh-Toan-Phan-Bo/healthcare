"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { Button } from "@/shared/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card"
import { Badge } from "@/shared/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs"
import { Input } from "@/shared/ui/input"
import { Label } from "@/shared/ui/label"
import { Textarea } from "@/shared/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/shared/ui/dialog"
import { Calendar, Clock, Bell, User, Star, MapPin } from "lucide-react"
import { useAuthStore } from "@/store"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getMe } from "@/api/auth"
import { getMyBookings, cancelBooking } from "@/api/bookings"
import { updateProfile } from "@/api/users"
import { createReview } from "@/api/reviews"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

export default function AccountPage() {
  const searchParams = useSearchParams()
  const defaultTab = searchParams.get("tab") || "appointments"
  const [activeTab, setActiveTab] = useState(defaultTab)

  useEffect(() => {
    const tab = searchParams.get("tab")
    if (tab) {
      setActiveTab(tab)
    }
  }, [searchParams])

  const auth = useAuthStore()
  const queryClient = useQueryClient()

  // Profile Edit State
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [editName, setEditName] = useState("")
  const [editPhone, setEditPhone] = useState("")
  const [editAvatar, setEditAvatar] = useState("")

  // Cancel Booking State
  const [cancelModalOpen, setCancelModalOpen] = useState(false)
  const [selectedCancelBookingId, setSelectedCancelBookingId] = useState("")
  const [cancelReason, setCancelReason] = useState("")

  // Review Booking State
  const [reviewModalOpen, setReviewModalOpen] = useState(false)
  const [selectedReviewBooking, setSelectedReviewBooking] = useState<any>(null)
  const [reviewRating, setReviewRating] = useState(5)
  const [reviewComment, setReviewComment] = useState("")

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
    if (meQuery.data) {
      auth.setUser(meQuery.data)
      setEditName(meQuery.data.name || "")
      setEditPhone(meQuery.data.phone || "")
      setEditAvatar(meQuery.data.avatar || "")
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meQuery.data])

  const profileMutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] })
      setIsEditingProfile(false)
    },
  })

  const cancelMutation = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) => cancelBooking(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myBookings"] })
      setCancelModalOpen(false)
    },
  })

  const reviewMutation = useMutation({
    mutationFn: createReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myBookings"] })
      setReviewModalOpen(false)
    },
  })

  const handleUpdateProfile = () => {
    profileMutation.mutate({ name: editName, phone: editPhone, avatar: editAvatar })
  }

  const handleCancelBooking = () => {
    if (!selectedCancelBookingId) return
    cancelMutation.mutate({ id: selectedCancelBookingId, reason: cancelReason })
  }

  const handleReviewSubmit = () => {
    if (!selectedReviewBooking) return
    reviewMutation.mutate({
      bookingId: selectedReviewBooking.id,
      rating: reviewRating,
      comment: reviewComment,
    })
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 bg-muted/30 py-12">
        <div className="container mx-auto max-w-5xl px-4">
          <div className="mb-8">
            <h1 className="mb-2 text-3xl font-bold">Tài Khoản Của Tôi</h1>
            <p className="text-muted-foreground">Quản lý lịch hẹn và thông tin cá nhân</p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
              <TabsTrigger value="appointments">
                <Calendar className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Lịch Hẹn</span>
              </TabsTrigger>
              <TabsTrigger value="profile">
                <User className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Hồ Sơ</span>
              </TabsTrigger>
              <TabsTrigger value="notifications">
                <Bell className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Thông Báo</span>
              </TabsTrigger>
            </TabsList>

            {/* Appointments Tab */}
            <TabsContent value="appointments" className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Lịch Hẹn Của Tôi</h2>
                <Link href="/clinics">
                  <Button className="bg-primary hover:bg-primary/90">Đặt Lịch Mới</Button>
                </Link>
              </div>

              {!auth.isAuthenticated ? (
                <Card>
                  <CardContent className="py-8 text-center border shadow-sm">
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
              ) : myBookingsQuery.data?.items?.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center border shadow-sm">
                    <Calendar className="mx-auto mb-4 h-12 w-12 text-muted-foreground/50" />
                    <h3 className="mb-1 text-lg font-medium">Chưa có lịch hẹn nào</h3>
                    <p className="text-sm text-muted-foreground">Bạn chưa đặt lịch hẹn khám nào trên hệ thống.</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {(myBookingsQuery.data?.items ?? []).map((b: any) => (
                    <Card key={b.id} className="overflow-hidden border-l-4" style={{ 
                      borderLeftColor: 
                        b.status === 'COMPLETED' ? '#10b981' : 
                        b.status === 'CONFIRMED' ? '#3b82f6' : 
                        b.status === 'CANCELLED' ? '#ef4444' : '#f59e0b'
                    }}>
                      <div className="flex flex-col sm:flex-row">
                        <div className="flex-1 p-5">
                          <div className="mb-3 flex items-start justify-between">
                            <div>
                              <h3 className="font-semibold text-lg">{b.clinic?.name ?? "Phòng khám"}</h3>
                              <div className="text-sm text-muted-foreground flex items-center mt-1">
                                <User className="mr-1 h-3.5 w-3.5" /> Bác sĩ: <span className="font-medium text-foreground ml-1">{b.doctor?.name ?? "—"}</span>
                              </div>
                            </div>
                            <Badge 
                              variant={b.status === 'CANCELLED' ? "destructive" : "default"}
                              className={
                                b.status === "COMPLETED" ? "bg-emerald-500 hover:bg-emerald-600" : 
                                b.status === "CONFIRMED" ? "bg-blue-500 hover:bg-blue-600" : 
                                b.status === "PENDING" ? "bg-amber-500 hover:bg-amber-600" : ""
                              }
                            >
                              {b.status}
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-3 text-sm mt-4 bg-muted/30 p-3 rounded-lg border">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-primary" />
                              <span className="font-medium">{String(b.bookingDate).slice(0, 10)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-primary" />
                              <span className="font-medium">{b.bookingTime}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-muted/10 p-5 flex flex-row sm:flex-col items-center justify-end sm:justify-center gap-2 border-t sm:border-t-0 sm:border-l w-full sm:w-[200px]">
                          {(b.status === "PENDING" || b.status === "CONFIRMED") && (
                            <Button 
                              variant="destructive" 
                              className="w-full"
                              onClick={() => {
                                setSelectedCancelBookingId(b.id)
                                setCancelReason("")
                                setCancelModalOpen(true)
                              }}
                            >
                              Hủy lịch
                            </Button>
                          )}
                          {b.status === "COMPLETED" && !b.review && (
                            <Button 
                              variant="outline" 
                              className="w-full border-primary text-primary hover:bg-primary/5"
                              onClick={() => {
                                setSelectedReviewBooking(b)
                                setReviewRating(5)
                                setReviewComment("")
                                setReviewModalOpen(true)
                              }}
                            >
                              <Star className="mr-2 h-4 w-4" /> Đánh giá
                            </Button>
                          )}
                          {b.status === "COMPLETED" && b.review && (
                            <span className="text-sm font-medium text-emerald-600 flex items-center">
                              <Star className="mr-1 h-3.5 w-3.5 fill-current" /> Đã đánh giá
                            </span>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Profile Tab */}
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Thông Tin Cá Nhân</CardTitle>
                  <CardDescription>Cập nhật thông tin của bạn</CardDescription>
                </CardHeader>
                <CardContent>
                  {isEditingProfile ? (
                    <div className="space-y-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label>Họ và Tên</Label>
                          <Input value={editName} onChange={(e) => setEditName(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                          <Label>Email (Không thể thay đổi)</Label>
                          <Input value={auth.user?.email || ""} disabled />
                        </div>
                        <div className="space-y-2">
                          <Label>Số Điện Thoại</Label>
                          <Input value={editPhone} onChange={(e) => setEditPhone(e.target.value)} />
                        </div>
                        <div className="space-y-2 lg:col-span-2">
                          <Label>Ảnh đại diện (URL)</Label>
                          <Input value={editAvatar} onChange={(e) => setEditAvatar(e.target.value)} placeholder="https://example.com/avatar.jpg" />
                        </div>
                      </div>
                      <div className="flex justify-end gap-2 mt-6">
                        <Button variant="outline" onClick={() => setIsEditingProfile(false)}>Hủy</Button>
                        <Button 
                          className="bg-primary" 
                          onClick={handleUpdateProfile}
                          disabled={profileMutation.isPending}
                        >
                          {profileMutation.isPending ? "Đang lưu..." : "Lưu thay đổi"}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="grid gap-6 md:grid-cols-2">
                        <div className="rounded-lg border p-4 bg-muted/20">
                          <p className="mb-1 text-sm font-medium text-muted-foreground">Họ và Tên</p>
                          <p className="font-semibold text-lg">{auth.user?.name ?? "—"}</p>
                        </div>
                        <div className="rounded-lg border p-4 bg-muted/20">
                          <p className="mb-1 text-sm font-medium text-muted-foreground">Email</p>
                          <p className="font-semibold text-lg">{auth.user?.email ?? "—"}</p>
                        </div>
                        <div className="rounded-lg border p-4 bg-muted/20">
                          <p className="mb-1 text-sm font-medium text-muted-foreground">Số Điện Thoại</p>
                          <p className="font-semibold text-lg">{auth.user?.phone || "Chưa cập nhật"}</p>
                        </div>
                        <div className="rounded-lg border p-4 bg-muted/20">
                          <p className="mb-1 text-sm font-medium text-muted-foreground">Vai trò</p>
                          <Badge variant="outline" className="text-primary border-primary/30 bg-primary/5 uppercase font-bold tracking-wider">{auth.user?.role}</Badge>
                        </div>
                      </div>
                      <Button className="bg-primary" onClick={() => setIsEditingProfile(true)}>
                        Chỉnh Sửa Thông Tin
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Notifications Tab */}
            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle>Thông Báo</CardTitle>
                  <CardDescription>Các thông báo và cập nhật mới nhất (Tính năng sắp ra mắt)</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-lg border p-4 opacity-70">
                    <div className="mb-2 flex items-center justify-between">
                      <p className="font-medium text-primary flex items-center"><Bell className="h-4 w-4 mr-2"/> Tính năng đang phát triển</p>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Hệ thống thông báo thời gian thực đang được xây dựng và sẽ sớm ra mắt trong thời gian tới.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />

      {/* Cancel Booking Dialog */}
      <Dialog open={cancelModalOpen} onOpenChange={setCancelModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận hủy lịch hẹn</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn hủy lịch hẹn này không? Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="reason">Lý do hủy (không bắt buộc)</Label>
            <Textarea 
              id="reason"
              placeholder="Vui lòng cho chúng tôi biết lý do..." 
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              className="mt-2"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCancelModalOpen(false)}>Quay lại</Button>
            <Button variant="destructive" onClick={handleCancelBooking} disabled={cancelMutation.isPending}>
              {cancelMutation.isPending ? "Đang hủy..." : "Xác nhận hủy"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Review Booking Dialog */}
      <Dialog open={reviewModalOpen} onOpenChange={setReviewModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Đánh giá bác sĩ / phòng khám</DialogTitle>
            <DialogDescription>
              Chia sẻ trải nghiệm của bạn để giúp những bệnh nhân khác.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label>Mức độ hài lòng (1 - 5 sao)</Label>
              <div className="flex gap-2 justify-center py-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button 
                    key={star} 
                    onClick={() => setReviewRating(star)}
                    className="p-1 focus:outline-none transition-transform hover:scale-110"
                  >
                    <Star className={`h-8 w-8 ${star <= reviewRating ? "fill-yellow-400 text-yellow-500 drop-shadow-sm" : "text-muted-foreground"}`} />
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="comment">Nhận xét của bạn</Label>
              <Textarea 
                id="comment"
                placeholder="Bác sĩ khám rất tận tâm..." 
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setReviewModalOpen(false)}>Hủy</Button>
            <Button className="bg-primary" onClick={handleReviewSubmit} disabled={reviewMutation.isPending}>
              {reviewMutation.isPending ? "Đang gửi..." : "Gửi đánh giá"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  )
}
