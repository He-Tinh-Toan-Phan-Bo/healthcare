"use client"

import { useState } from "react"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { Button } from "@/shared/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card"
import { Input } from "@/shared/ui/input"
import { Label } from "@/shared/ui/label"
import { RadioGroup, RadioGroupItem } from "@/shared/ui/radio-group"
import { Calendar, CheckCircle2, ChevronRight } from "lucide-react"
import { useMutation } from "@tanstack/react-query"
import { postBooking } from "@/api/bookings"
import { useAuthStore } from "@/store"
import { useRouter, useSearchParams } from "next/navigation"

export default function BookingPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const auth = useAuthStore()

  const [step, setStep] = useState(1)
  const [selectedPackage, setSelectedPackage] = useState("")
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTime, setSelectedTime] = useState("")
  const [clinicId, setClinicId] = useState(searchParams.get("clinicId") || "")

  const [patientName, setPatientName] = useState("")
  const [patientPhone, setPatientPhone] = useState("")
  const [patientEmail, setPatientEmail] = useState("")

  const packages = [
    { id: "basic", name: "Gói Khám Sức Khỏe Cơ Bản", price: "2.000.000đ" },
    { id: "comprehensive", name: "Gói Khám Sức Khỏe Toàn Diện", price: "6.000.000đ" },
    { id: "premium", name: "Gói Khám Sức Khỏe Cao Cấp", price: "12.000.000đ" },
  ]

  const timeSlots = {
    today: ["10:00", "11:30", "14:00", "16:30"],
    tomorrow: ["9:00", "10:30", "13:00", "15:00", "17:00"],
  }

  const createBookingMutation = useMutation({
    mutationFn: postBooking,
    onSuccess: () => {
      router.push("/account")
    },
  })

  const resolveDate = () => {
    const now = new Date()
    const d = selectedDate === "tomorrow" ? new Date(now.getTime() + 24 * 60 * 60 * 1000) : now
    return d.toISOString().slice(0, 10)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 bg-muted/30 py-12">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <div className="mb-8">
              <h1 className="mb-2 text-3xl font-bold">Đặt Lịch Khám</h1>
              <p className="text-muted-foreground">Hoàn thành các bước dưới đây để đặt lịch khám</p>
            </div>

            {/* Progress Steps */}
            <div className="mb-8 flex items-center justify-between">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex flex-1 items-center">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full ${
                      s <= step ? "bg-primary text-white" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {s < step ? <CheckCircle2 className="h-5 w-5" /> : s}
                  </div>
                  <div className={`ml-2 ${s === step ? "font-semibold" : "text-muted-foreground"}`}>
                    {s === 1 && "Chọn gói"}
                    {s === 2 && "Chọn thời gian"}
                    {s === 3 && "Xác nhận"}
                  </div>
                  {s < 3 && <ChevronRight className="mx-4 h-5 w-5 text-muted-foreground" />}
                </div>
              ))}
            </div>

            {/* Step 1: Choose Package */}
            {step === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle>Chọn Gói Khám Sức Khỏe</CardTitle>
                  <CardDescription>Chọn gói khám phù hợp với nhu cầu của bạn</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <RadioGroup value={selectedPackage} onValueChange={setSelectedPackage}>
                    {packages.map((pkg) => (
                      <div
                        key={pkg.id}
                        className="flex items-center space-x-3 rounded-lg border p-4 hover:border-primary"
                      >
                        <RadioGroupItem value={pkg.id} id={pkg.id} />
                        <Label htmlFor={pkg.id} className="flex flex-1 cursor-pointer items-center justify-between">
                          <span className="font-medium">{pkg.name}</span>
                          <span className="text-lg font-bold text-primary">{pkg.price}</span>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>

                  <div className="flex justify-end pt-4">
                    <Button onClick={() => setStep(2)} disabled={!selectedPackage} className="bg-primary">
                      Tiếp Theo
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 2: Choose Date & Time */}
            {step === 2 && (
              <Card>
                <CardHeader>
                  <CardTitle>Chọn Ngày và Giờ Khám</CardTitle>
                  <CardDescription>Chọn thời gian phù hợp cho lịch hẹn của bạn</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <h3 className="mb-3 font-semibold">Hôm nay - 29/12/2025</h3>
                      <div className="grid grid-cols-2 gap-2">
                        {timeSlots.today.map((time) => (
                          <Button
                            key={time}
                            variant={selectedTime === `today-${time}` ? "default" : "outline"}
                            className={selectedTime === `today-${time}` ? "bg-primary" : ""}
                            onClick={() => {
                              setSelectedDate("today")
                              setSelectedTime(`today-${time}`)
                            }}
                          >
                            {time}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="mb-3 font-semibold">Ngày mai - 30/12/2025</h3>
                      <div className="grid grid-cols-2 gap-2">
                        {timeSlots.tomorrow.map((time) => (
                          <Button
                            key={time}
                            variant={selectedTime === `tomorrow-${time}` ? "default" : "outline"}
                            className={selectedTime === `tomorrow-${time}` ? "bg-primary" : ""}
                            onClick={() => {
                              setSelectedDate("tomorrow")
                              setSelectedTime(`tomorrow-${time}`)
                            }}
                          >
                            {time}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between pt-4">
                    <Button variant="outline" onClick={() => setStep(1)}>
                      Quay Lại
                    </Button>
                    <Button onClick={() => setStep(3)} disabled={!selectedTime} className="bg-primary">
                      Tiếp Theo
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 3: Confirm Booking */}
            {step === 3 && (
              <Card>
                <CardHeader>
                  <CardTitle>Xác Nhận Thông Tin</CardTitle>
                  <CardDescription>Vui lòng kiểm tra và xác nhận thông tin đặt lịch</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    {!auth.isAuthenticated && (
                      <div className="rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
                        Bạn cần đăng nhập trước khi đặt lịch.{" "}
                        <button className="underline" onClick={() => router.push("/login")}>
                          Đăng nhập
                        </button>
                      </div>
                    )}

                    <div>
                      <Label htmlFor="clinicId">Clinic ID</Label>
                      <Input
                        id="clinicId"
                        placeholder="UUID của phòng khám"
                        value={clinicId}
                        onChange={(e) => setClinicId(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="name">Họ và Tên</Label>
                      <Input
                        id="name"
                        placeholder="Nguyễn Văn A"
                        value={patientName}
                        onChange={(e) => setPatientName(e.target.value)}
                      />
                    </div>

                    <div>
                      <Label htmlFor="phone">Số Điện Thoại</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="0912345678"
                        value={patientPhone}
                        onChange={(e) => setPatientPhone(e.target.value)}
                      />
                    </div>

                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="email@example.com"
                        value={patientEmail}
                        onChange={(e) => setPatientEmail(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="rounded-lg bg-muted/50 p-4">
                    <h3 className="mb-3 font-semibold">Thông Tin Đặt Lịch</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Gói khám:</span>
                        <span className="font-medium">{packages.find((p) => p.id === selectedPackage)?.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Ngày khám:</span>
                        <span className="font-medium">{selectedDate === "today" ? "29/12/2025" : "30/12/2025"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Giờ khám:</span>
                        <span className="font-medium">{selectedTime.split("-")[1]}</span>
                      </div>
                      <div className="flex justify-between border-t pt-2">
                        <span className="font-semibold">Tổng cộng:</span>
                        <span className="text-lg font-bold text-primary">
                          {packages.find((p) => p.id === selectedPackage)?.price}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between pt-4">
                    <Button variant="outline" onClick={() => setStep(2)}>
                      Quay Lại
                    </Button>
                    <Button
                      className="bg-primary"
                      disabled={
                        createBookingMutation.isPending ||
                        !auth.isAuthenticated ||
                        !clinicId ||
                        !patientName ||
                        !patientEmail ||
                        !patientPhone
                      }
                      onClick={() =>
                        createBookingMutation.mutate({
                          clinicId,
                          patientName,
                          patientEmail,
                          patientPhone,
                          bookingDate: resolveDate(),
                          bookingTime: selectedTime.split("-")[1],
                        })
                      }
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {createBookingMutation.isPending ? "Đang đặt lịch..." : "Xác Nhận Đặt Lịch"}
                    </Button>
                  </div>
                  {createBookingMutation.isError && (
                    <div className="text-sm text-destructive">
                      Đặt lịch thất bại. Vui lòng kiểm tra lại thông tin.
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
