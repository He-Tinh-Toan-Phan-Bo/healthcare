"use client"

import { useState, useEffect, useMemo } from "react"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { Button } from "@/shared/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card"
import { Input } from "@/shared/ui/input"
import { Label } from "@/shared/ui/label"
import { Calendar as CalendarIcon, CheckCircle2, ChevronRight, MapPin, User, Clock } from "lucide-react"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import { useMutation, useQuery } from "@tanstack/react-query"
import { postBooking } from "@/api/bookings"
import { getDoctors, getDoctorAvailability, getDoctorDetail } from "@/api/doctors"
import { getClinics } from "@/api/clinics"
import { useAuthStore } from "@/store"
import { useRouter, useSearchParams } from "next/navigation"
import { Calendar } from "@/shared/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover"
import { cn } from "@/shared/utils"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select"

export default function BookingPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const auth = useAuthStore()

  const [step, setStep] = useState(1)

  useEffect(() => {
    if (!auth.isAuthenticated) {
      router.push(`/login?next=/booking`)
    }
  }, [auth.isAuthenticated, router])
  
  const [clinicId, setClinicId] = useState(searchParams.get("clinicId") || "")
  const [doctorId, setDoctorId] = useState(searchParams.get("doctorId") || "")
  
  const [date, setDate] = useState<Date>(new Date())
  const [selectedTime, setSelectedTime] = useState("")

  const [patientName, setPatientName] = useState("")
  const [patientPhone, setPatientPhone] = useState("")
  const [patientEmail, setPatientEmail] = useState("")

  useEffect(() => {
    if (auth.user) {
      setPatientName(auth.user.name || "")
      setPatientPhone(auth.user.phone || "")
      setPatientEmail(auth.user.email || "")
    }
  }, [auth.user])

  const clinicsQuery = useQuery({
    queryKey: ["clinics"],
    queryFn: () => getClinics({ limit: 50 }),
  })

  // Lấy danh sách bác sĩ theo phòng khám đã chọn
  const doctorsQuery = useQuery({
    queryKey: ["doctors", clinicId],
    enabled: !!clinicId,
    queryFn: () => getDoctors({ clinicId }),
  })

  const doctorDetailQuery = useQuery({
    queryKey: ["doctorDetail", doctorId],
    enabled: !!doctorId,
    queryFn: () => getDoctorDetail(doctorId),
  })

  // Nếu doctorId thay đổi và có dữ liệu detail, tự động set clinicId
  useEffect(() => {
    if (doctorDetailQuery.data && doctorDetailQuery.data.clinic) {
      setClinicId(doctorDetailQuery.data.clinic.id)
    }
  }, [doctorDetailQuery.data])

  const availQuery = useQuery({
    queryKey: ["availability", doctorId, format(date, "yyyy-MM-dd")],
    enabled: !!doctorId && !!date && step >= 2,
    queryFn: () => getDoctorAvailability(doctorId, format(date, "yyyy-MM-dd")),
  })

  const availableSlots = useMemo(() => {
    const res = availQuery.data as any
    if (!res) return []
    if (Array.isArray(res)) return res
    return res.availableSlots || res.items || []
  }, [availQuery.data])

  const createBookingMutation = useMutation({
    mutationFn: postBooking,
    onSuccess: () => {
      router.push("/account")
    },
  })

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
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                      s <= step ? "bg-primary text-white" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {s < step ? <CheckCircle2 className="h-5 w-5" /> : s}
                  </div>
                  <div className={`hidden sm:block ml-2 ${s === step ? "font-semibold" : "text-muted-foreground"}`}>
                    {s === 1 && "Thông tin"}
                    {s === 2 && "Thời gian"}
                    {s === 3 && "Xác nhận"}
                  </div>
                  {s < 3 && <ChevronRight className="mx-2 sm:mx-4 h-5 w-5 shrink-0 text-muted-foreground" />}
                </div>
              ))}
            </div>

            {/* Step 1: Check info */}
            {step === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle>Thông tin người đặt & Bác sĩ</CardTitle>
                  <CardDescription>Kiểm tra thông tin trước khi chọn lịch</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">


                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">Họ và Tên (*)</Label>
                      <Input
                        id="name"
                        value={patientName}
                        onChange={(e) => setPatientName(e.target.value)}
                        placeholder="Nguyễn Văn A"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Số Điện Thoại (*)</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={patientPhone}
                        onChange={(e) => setPatientPhone(e.target.value)}
                        placeholder="Ví dụ: 0912345678"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email (*)</Label>
                      <Input
                        id="email"
                        type="email"
                        value={patientEmail}
                        onChange={(e) => setPatientEmail(e.target.value)}
                        placeholder="email@example.com"
                      />
                    </div>
                  </div>

                  <div className="mt-6 border-t pt-6 space-y-4">
                    <Label className="text-base font-semibold">Chọn Cơ sở & Bác sĩ</Label>
                    
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Phòng khám</Label>
                        <Select value={clinicId} onValueChange={(val) => {
                          setClinicId(val)
                          setDoctorId("") // Reset doctor when clinic changes
                        }}>
                          <SelectTrigger className="bg-white border-gray-200">
                            <SelectValue placeholder="Chọn phòng khám" />
                          </SelectTrigger>
                          <SelectContent>
                            {(clinicsQuery.data?.items ?? []).map((clinic: any) => (
                              <SelectItem key={clinic.id} value={clinic.id}>
                                {clinic.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Bác sĩ</Label>
                        <Select 
                          value={doctorId} 
                          onValueChange={setDoctorId}
                          disabled={!clinicId || doctorsQuery.isLoading}
                        >
                          <SelectTrigger className="bg-white border-gray-200">
                            <SelectValue placeholder={doctorsQuery.isLoading ? "Đang tải..." : "Chọn bác sĩ"} />
                          </SelectTrigger>
                          <SelectContent>
                            {(doctorsQuery.data?.items ?? []).map((doc: any) => (
                              <SelectItem key={doc.id} value={doc.id}>
                                {doc.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {doctorId && doctorDetailQuery.data && (
                      <div className="flex bg-primary/5 p-4 rounded-xl items-center gap-4 border border-primary/10 animate-in fade-in slide-in-from-top-2 duration-300 mt-2">
                        <div className="h-14 w-14 overflow-hidden rounded-full border-2 border-white shadow-sm bg-background">
                          <img 
                            src={doctorDetailQuery.data.avatar || "/modern-clinic-.jpg"} 
                            alt={doctorDetailQuery.data.name} 
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900">{doctorDetailQuery.data.name}</h4>
                          <p className="text-xs text-muted-foreground flex items-center mt-0.5">
                            <MapPin className="mr-1 h-3 w-3 text-primary" /> {doctorDetailQuery.data.clinic?.name}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end pt-4">
                    <Button 
                      onClick={() => {
                        if (!patientName || !patientPhone || !patientEmail || !doctorId) {
                          alert("Vui lòng điền đầy đủ thông tin bắt buộc (*)")
                          return
                        }
                        setStep(2)
                      }} 
                      className="bg-primary hover:bg-primary/90 shadow-md transition-all active:scale-95 px-8"
                    >
                      Tiếp Theo: Chọn Thời Gian
                      <ChevronRight className="ml-2 h-4 w-4" />
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
                  <CardDescription>Lịch trống thực tế của Bác sĩ</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  
                  <div className="grid gap-8 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Chọn Ngày</Label>
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={(d) => {
                          if (d) {
                            setDate(d)
                            setSelectedTime("") // reset time when date changes
                          }
                        }}
                        disabled={(d) => d < new Date(new Date().setHours(0, 0, 0, 0))}
                        initialFocus
                        className="rounded-md border shadow"
                      />
                    </div>

                    <div className="space-y-4">
                      <Label>
                        Khung Giờ (Ngày {format(date, "dd/MM/yyyy")})
                      </Label>
                      {availQuery.isLoading ? (
                        <div className="text-sm text-muted-foreground italic">Đang tải lịch trống...</div>
                      ) : availableSlots.length === 0 ? (
                        <div className="text-sm text-amber-600 bg-amber-50 p-4 rounded-xl border border-amber-200">
                          Bác sĩ không có lịch làm việc ngày này. Vui lòng chọn ngày khác.
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                            {availableSlots.map((slot: any, idx: number) => {
                              const timeValue = typeof slot === 'string' ? slot : slot.time;
                              const isAvailable = typeof slot === 'string' ? true : (slot.isAvailable ?? true);
                              
                              return (
                                <Button
                                  key={`${timeValue}-${idx}`}
                                  variant={selectedTime === timeValue ? "default" : "outline"}
                                  className={cn(
                                    "transition-all duration-200",
                                    selectedTime === timeValue ? "bg-primary shadow-md scale-[1.02]" : "hover:border-primary hover:text-primary"
                                  )}
                                  disabled={!isAvailable}
                                  onClick={() => setSelectedTime(timeValue)}
                                >
                                  <Clock className="mr-2 h-4 w-4" />
                                  {timeValue}
                                </Button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-between pt-4 border-t">
                    <Button variant="outline" onClick={() => setStep(1)}>
                      Quay Lại
                    </Button>
                    <Button onClick={() => setStep(3)} disabled={!selectedTime} className="bg-primary">
                      Tiếp Theo: Xác nhận
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 3: Confirm Booking */}
            {step === 3 && (
              <Card>
                <CardHeader>
                  <CardTitle>Xác Nhận Thông Tin Đặt Lịch</CardTitle>
                  <CardDescription>Vui lòng kiểm tra lại tất cả thông tin</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="rounded-lg bg-muted/30 p-6 border">
                    <h3 className="mb-4 font-semibold text-lg border-b pb-2">Thông tin người bệnh</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 text-sm mb-6">
                      <div>
                        <span className="text-muted-foreground block mb-1">Họ và tên:</span>
                        <span className="font-medium text-base">{patientName}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block mb-1">Số điện thoại:</span>
                        <span className="font-medium text-base">{patientPhone}</span>
                      </div>
                      <div className="md:col-span-2">
                        <span className="text-muted-foreground block mb-1">Email:</span>
                        <span className="font-medium text-base">{patientEmail}</span>
                      </div>
                    </div>

                    <h3 className="mb-4 font-semibold text-lg border-b pb-2">Chi tiết lịch khám</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 text-sm bg-background p-4 rounded-lg border">
                      <div>
                        <span className="text-muted-foreground block mb-1">Bác sĩ:</span>
                        <span className="font-medium text-base text-primary">{doctorDetailQuery.data?.name}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block mb-1">Phòng khám:</span>
                        <span className="font-medium">{doctorDetailQuery.data?.clinic?.name}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block mb-1"><CalendarIcon className="h-4 w-4 inline mr-1" />Ngày khám:</span>
                        <span className="font-medium text-base">{format(date, "dd/MM/yyyy", { locale: vi })}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block mb-1"><Clock className="h-4 w-4 inline mr-1" />Giờ khám:</span>
                        <span className="font-medium text-base text-amber-600">{selectedTime}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between pt-4">
                    <Button variant="outline" onClick={() => setStep(2)}>
                      Quay Lại
                    </Button>
                    <Button
                      className="bg-primary"
                      disabled={createBookingMutation.isPending}
                      onClick={() =>
                        createBookingMutation.mutate({
                          clinicId: clinicId,
                          doctorId: doctorId,
                          patientName,
                          patientEmail,
                          patientPhone,
                          bookingDate: format(date, "yyyy-MM-dd"),
                          bookingTime: selectedTime,
                        })
                      }
                    >
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      {createBookingMutation.isPending ? "Đang xử lý..." : "Xác Nhận Đặt Lịch"}
                    </Button>
                  </div>
                  {createBookingMutation.isError && (
                    <div className="text-sm text-destructive mt-2 text-center p-2 rounded bg-destructive/10">
                      Đã có lỗi xảy ra. Slot khám có thể đã được đặt hoặc thông tin không hợp lệ. Vui lòng chọn giờ khác!
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
