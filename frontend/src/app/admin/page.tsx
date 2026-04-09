"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
    Activity,
    Building2,
    CalendarCheck2,
    CalendarClock,
    ImageIcon,
    Newspaper,
    ShieldCheck,
    Stethoscope,
    UserRoundCheck,
    Users,
} from "lucide-react"
import { Button } from "@/shared/ui/button"
import { Input } from "@/shared/ui/input"
import { Label } from "@/shared/ui/label"
import { Switch } from "@/shared/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card"
import { Textarea } from "@/shared/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs"
import { Badge } from "@/shared/ui/badge"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/shared/ui/table"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/shared/ui/select"
import { useAuthStore } from "@/store"
import {
    createAdminArticle,
    createAdminClinic,
    createAdminDoctor,
    createAdminUser,
    deleteAdminArticle,
    deleteAdminClinic,
    deleteAdminDoctor,
    deleteAdminUser,
    getAdminArticles,
    getAdminClinics,
    getAdminDoctors,
    getAdminUsers,
    updateAdminArticle,
    updateAdminClinic,
    updateAdminDoctor,
    updateAdminUser,
    type AdminArticle,
    type AdminClinic,
    type AdminDoctor,
    type AdminRole,
} from "@/api/admin"
import {
    getDoctorBookings,
    getDoctorSettings,
    patchDoctorBookingStatus,
    putDoctorSchedule,
    putDoctorServices,
    type DoctorBookingItem,
    type DoctorBookingStatus,
    type DoctorServicePrice,
    type DoctorWorkingHour,
} from "@/api/doctor-admin"
import { getSpecialties } from "@/api/specialties"
import { ARTICLE_DEFAULTS, ARTICLE_QUERY_KEYS } from "@/shared/constants"

type RoleFilter = "ALL" | AdminRole
type BookingFilter = "ALL" | DoctorBookingStatus

type WeeklyScheduleRow = {
    dayOfWeek: number
    enabled: boolean
    startTime: string
    endTime: string
}

type SpecialtyOption = {
    id: string
    name: string
}

const dayOptions = [
    { value: 0, label: "Chủ nhật" },
    { value: 1, label: "Thứ 2" },
    { value: 2, label: "Thứ 3" },
    { value: 3, label: "Thứ 4" },
    { value: 4, label: "Thứ 5" },
    { value: 5, label: "Thứ 6" },
    { value: 6, label: "Thứ 7" },
]

function normalizeRole(role?: string) {
    const normalized = String(role || "").toUpperCase()
    if (normalized === "SUPER_ADMIN") {
        return "ADMIN"
    }
    return normalized
}

function getRoleLabel(role: string | undefined) {
    switch (normalizeRole(role)) {
        case "ADMIN":
            return "Quản trị viên"
        case "DOCTOR":
            return "Bác sĩ"
        case "PATIENT":
            return "Bệnh nhân"
        default:
            return role || "Không xác định"
    }
}

function getBookingStatusLabel(status: DoctorBookingStatus) {
    switch (status) {
        case "PENDING":
            return "Chờ xác nhận"
        case "CONFIRMED":
            return "Đã xác nhận"
        case "COMPLETED":
            return "Đã khám"
        case "CANCELLED":
            return "Đã hủy"
        default:
            return status
    }
}

function getBookingStatusClass(status: DoctorBookingStatus) {
    switch (status) {
        case "PENDING":
            return "bg-amber-100 text-amber-700 border-amber-200"
        case "CONFIRMED":
            return "bg-primary/10 text-primary border-primary/20"
        case "COMPLETED":
            return "bg-emerald-100 text-emerald-700 border-emerald-200"
        case "CANCELLED":
            return "bg-rose-100 text-rose-700 border-rose-200"
        default:
            return ""
    }
}

function formatDate(dateValue: string) {
    try {
        return new Date(dateValue).toLocaleDateString("vi-VN")
    } catch {
        return dateValue
    }
}

function getDefaultWeeklySchedule(): WeeklyScheduleRow[] {
    return dayOptions.map((day) => ({
        dayOfWeek: day.value,
        enabled: day.value >= 1 && day.value <= 5,
        startTime: "08:00",
        endTime: "17:00",
    }))
}

function buildWeeklySchedule(workingHours: DoctorWorkingHour[] | undefined): WeeklyScheduleRow[] {
    const defaults = getDefaultWeeklySchedule()
    if (!workingHours?.length) {
        return defaults
    }

    const byDay = new Map<number, DoctorWorkingHour>()
    for (const row of workingHours) {
        if (!byDay.has(row.dayOfWeek)) {
            byDay.set(row.dayOfWeek, row)
        }
    }

    return defaults.map((row) => {
        const current = byDay.get(row.dayOfWeek)
        if (!current) {
            return { ...row, enabled: false }
        }
        return {
            dayOfWeek: row.dayOfWeek,
            enabled: true,
            startTime: current.startTime,
            endTime: current.endTime,
        }
    })
}

export default function AdminPage() {
    const router = useRouter()
    const auth = useAuthStore()
    const role = useMemo(() => normalizeRole(auth.user?.role), [auth.user?.role])

    useEffect(() => {
        if (!auth.isLoading && !auth.isAuthenticated) {
            router.replace("/login?next=/admin")
        }
    }, [auth.isAuthenticated, auth.isLoading, router])

    if (auth.isLoading) {
        return <div className="p-8 text-center">Đang tải...</div>
    }

    if (!auth.isAuthenticated) {
        return null
    }

    if (role === "PATIENT") {
        return (
            <main className="flex min-h-screen items-center justify-center bg-muted/40 p-6">
                <Card className="w-full max-w-xl border-rose-200">
                    <CardHeader>
                        <CardTitle>403 - Không có quyền truy cập</CardTitle>
                        <CardDescription>
                            Tài khoản bệnh nhân không thể truy cập trang quản trị.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex gap-3">
                        <Link href="/">
                            <Button>Về trang chủ</Button>
                        </Link>
                        <Link href="/account">
                            <Button variant="outline">Đến trang tài khoản</Button>
                        </Link>
                    </CardContent>
                </Card>
            </main>
        )
    }

    return (
        <main className="min-h-screen bg-muted/40 py-8">
            <div className="container mx-auto max-w-7xl px-4">
                <AdminTopBar
                    role={role}
                    email={auth.user?.email || ""}
                    onLogout={() => auth.logout()}
                />

                {role === "DOCTOR" ? <DoctorAdminSection /> : <SystemAdminSection />}
            </div>
        </main>
    )
}

function AdminTopBar({
    role,
    email,
    onLogout,
}: Readonly<{
    role: string
    email: string
    onLogout: () => void
}>) {
    return (
        <div className="mb-6 rounded-2xl border border-primary/20 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <div className="mb-2 flex items-center gap-2">
                        <ShieldCheck className="h-5 w-5 text-primary" />
                        <h1 className="text-xl font-semibold">Trung tâm quản trị Healthcare</h1>
                    </div>
                    <p className="text-sm text-muted-foreground">{email}</p>
                    <p className="mt-1 text-xs text-muted-foreground">Vai trò: {getRoleLabel(role)}</p>
                </div>

                <div className="flex items-center gap-3">
                    <Badge variant="outline" className="border-primary/20 bg-primary/10 text-primary">
                        {getRoleLabel(role)}
                    </Badge>
                    <Button variant="outline" onClick={onLogout}>
                        Đăng xuất
                    </Button>
                </div>
            </div>
        </div>
    )
}

function DoctorAdminSection() {
    const queryClient = useQueryClient()

    const pendingBookingsQuery = useQuery({
        queryKey: ["doctor-admin", "bookings", "pending"],
        queryFn: () => getDoctorBookings({ status: "PENDING" }),
    })

    const allBookingsQuery = useQuery({
        queryKey: ["doctor-admin", "bookings", "all"],
        queryFn: () => getDoctorBookings(),
    })

    const settingsQuery = useQuery({
        queryKey: ["doctor-admin", "settings"],
        queryFn: getDoctorSettings,
    })

    const [bookingFilter, setBookingFilter] = useState<BookingFilter>("ALL")
    const [slotDurationMinutes, setSlotDurationMinutes] = useState(30)
    const [weeklySchedule, setWeeklySchedule] = useState<WeeklyScheduleRow[]>(
        getDefaultWeeklySchedule(),
    )
    const [scheduleError, setScheduleError] = useState<string | null>(null)
    const [services, setServices] = useState<DoctorServicePrice[]>([])

    const allBookings = allBookingsQuery.data?.items ?? []
    const pendingBookings = pendingBookingsQuery.data?.items ?? []

    const filteredBookings = useMemo(() => {
        if (bookingFilter === "ALL") {
            return allBookings
        }
        return allBookings.filter((item) => item.status === bookingFilter)
    }, [allBookings, bookingFilter])

    const bookingStats = useMemo(() => {
        const total = allBookings.length
        const pending = allBookings.filter((item) => item.status === "PENDING").length
        const confirmed = allBookings.filter((item) => item.status === "CONFIRMED").length
        const completed = allBookings.filter((item) => item.status === "COMPLETED").length
        return { total, pending, confirmed, completed }
    }, [allBookings])

    useEffect(() => {
        if (settingsQuery.data?.settings) {
            setSlotDurationMinutes(settingsQuery.data.settings.slotDurationMinutes ?? 30)
            setWeeklySchedule(buildWeeklySchedule(settingsQuery.data.settings.workingHours))
            setServices(settingsQuery.data.settings.services ?? [])
        }
    }, [settingsQuery.data])

    const updateBookingStatusMutation = useMutation({
        mutationFn: ({ id, status }: { id: string; status: "CONFIRMED" | "COMPLETED" | "CANCELLED" }) =>
            patchDoctorBookingStatus(id, { status }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["doctor-admin", "bookings"] })
        },
    })

    const saveScheduleMutation = useMutation({
        mutationFn: putDoctorSchedule,
        onSuccess: () => {
            setScheduleError(null)
            queryClient.invalidateQueries({ queryKey: ["doctor-admin", "settings"] })
        },
    })

    const saveServicesMutation = useMutation({
        mutationFn: putDoctorServices,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["doctor-admin", "settings"] })
        },
    })

    const handleSaveSchedule = () => {
        const workingHours: DoctorWorkingHour[] = weeklySchedule
            .filter((row) => row.enabled)
            .map((row) => ({
                dayOfWeek: row.dayOfWeek,
                startTime: row.startTime,
                endTime: row.endTime,
            }))

        if (!workingHours.length) {
            setScheduleError("Cần chọn ít nhất 1 ngày làm việc trong tuần.")
            return
        }

        setScheduleError(null)
        saveScheduleMutation.mutate({ slotDurationMinutes, workingHours })
    }

    const updateWeeklyRow = (
        dayOfWeek: number,
        patch: Partial<Omit<WeeklyScheduleRow, "dayOfWeek">>,
    ) => {
        setWeeklySchedule((prev) =>
            prev.map((row) =>
                row.dayOfWeek === dayOfWeek
                    ? {
                        ...row,
                        ...patch,
                    }
                    : row,
            ),
        )
    }

    return (
        <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
                <StatCard icon={CalendarClock} title="Tổng lịch khám" value={String(bookingStats.total)} />
                <StatCard icon={Activity} title="Chờ xác nhận" value={String(bookingStats.pending)} />
                <StatCard icon={CalendarCheck2} title="Đã xác nhận" value={String(bookingStats.confirmed)} />
                <StatCard icon={UserRoundCheck} title="Đã hoàn tất" value={String(bookingStats.completed)} />
            </div>

            <Tabs defaultValue="bookings" className="space-y-4">
                <TabsList className="grid h-auto w-full grid-cols-3 gap-1 bg-muted p-1">
                    <TabsTrigger className="py-2 data-[state=active]:bg-primary data-[state=active]:text-white" value="bookings">
                        Lịch khám bệnh nhân
                    </TabsTrigger>
                    <TabsTrigger className="py-2 data-[state=active]:bg-primary data-[state=active]:text-white" value="schedule">
                        Lịch làm việc
                    </TabsTrigger>
                    <TabsTrigger className="py-2 data-[state=active]:bg-primary data-[state=active]:text-white" value="services">
                        Dịch vụ và giá
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="bookings" className="space-y-4">
                    <Card className="border-amber-200 bg-amber-50/60">
                        <CardHeader>
                            <CardTitle>Xác nhận lịch khám đang chờ</CardTitle>
                            <CardDescription>
                                Bệnh nhân đặt lịch sẽ ở trạng thái chờ. Bác sĩ xác nhận thì lịch mới hoàn tất.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <BookingTable
                                items={pendingBookings}
                                emptyText="Hiện không có lịch nào đang chờ xác nhận."
                                renderActions={(item) => (
                                    <div className="space-x-2">
                                        <Button
                                            size="sm"
                                            disabled={updateBookingStatusMutation.isPending}
                                            onClick={() =>
                                                updateBookingStatusMutation.mutate({ id: item.id, status: "CONFIRMED" })
                                            }
                                        >
                                            Xác nhận
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="destructive"
                                            disabled={updateBookingStatusMutation.isPending}
                                            onClick={() =>
                                                updateBookingStatusMutation.mutate({ id: item.id, status: "CANCELLED" })
                                            }
                                        >
                                            Từ chối
                                        </Button>
                                    </div>
                                )}
                            />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                            <div>
                                <CardTitle>Tất cả lịch khám</CardTitle>
                                <CardDescription>Theo dõi toàn bộ trạng thái lịch khám của bạn</CardDescription>
                            </div>

                            <div className="w-full md:w-56">
                                <Select value={bookingFilter} onValueChange={(v) => setBookingFilter(v as BookingFilter)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Lọc trạng thái" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="ALL">Tất cả trạng thái</SelectItem>
                                        <SelectItem value="PENDING">Chờ xác nhận</SelectItem>
                                        <SelectItem value="CONFIRMED">Đã xác nhận</SelectItem>
                                        <SelectItem value="COMPLETED">Đã hoàn tất</SelectItem>
                                        <SelectItem value="CANCELLED">Đã hủy</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <BookingTable
                                items={filteredBookings}
                                emptyText="Không có dữ liệu lịch khám phù hợp bộ lọc."
                                renderActions={(item) => (
                                    <div className="space-x-2">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            disabled={item.status !== "PENDING" || updateBookingStatusMutation.isPending}
                                            onClick={() =>
                                                updateBookingStatusMutation.mutate({ id: item.id, status: "CONFIRMED" })
                                            }
                                        >
                                            Xác nhận
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            disabled={item.status !== "CONFIRMED" || updateBookingStatusMutation.isPending}
                                            onClick={() =>
                                                updateBookingStatusMutation.mutate({ id: item.id, status: "COMPLETED" })
                                            }
                                        >
                                            Hoàn tất
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="destructive"
                                            disabled={
                                                item.status === "COMPLETED" ||
                                                item.status === "CANCELLED" ||
                                                updateBookingStatusMutation.isPending
                                            }
                                            onClick={() =>
                                                updateBookingStatusMutation.mutate({ id: item.id, status: "CANCELLED" })
                                            }
                                        >
                                            Hủy
                                        </Button>
                                    </div>
                                )}
                            />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="schedule">
                    <Card>
                        <CardHeader>
                            <CardTitle>Thiết lập lịch khám theo ngày trong tuần</CardTitle>
                            <CardDescription>
                                Bạn có thể bật/tắt từng ngày, điều chỉnh giờ bắt đầu - kết thúc và thời lượng mỗi slot.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-5">
                            <div className="max-w-xs space-y-2">
                                <Label>Thời lượng mỗi slot (phút)</Label>
                                <Input
                                    type="number"
                                    min={5}
                                    max={180}
                                    value={slotDurationMinutes}
                                    onChange={(e) => setSlotDurationMinutes(Number(e.target.value) || 30)}
                                />
                            </div>

                            <div className="rounded-lg border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Ngày</TableHead>
                                            <TableHead>Bật lịch</TableHead>
                                            <TableHead>Giờ bắt đầu</TableHead>
                                            <TableHead>Giờ kết thúc</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {weeklySchedule.map((row) => {
                                            const day = dayOptions.find((item) => item.value === row.dayOfWeek)
                                            return (
                                                <TableRow key={row.dayOfWeek}>
                                                    <TableCell className="font-medium">{day?.label}</TableCell>
                                                    <TableCell>
                                                        <Switch
                                                            checked={row.enabled}
                                                            onCheckedChange={(checked) =>
                                                                updateWeeklyRow(row.dayOfWeek, { enabled: checked })
                                                            }
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <Input
                                                            type="time"
                                                            value={row.startTime}
                                                            disabled={!row.enabled}
                                                            onChange={(e) =>
                                                                updateWeeklyRow(row.dayOfWeek, {
                                                                    startTime: e.target.value,
                                                                })
                                                            }
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <Input
                                                            type="time"
                                                            value={row.endTime}
                                                            disabled={!row.enabled}
                                                            onChange={(e) =>
                                                                updateWeeklyRow(row.dayOfWeek, {
                                                                    endTime: e.target.value,
                                                                })
                                                            }
                                                        />
                                                    </TableCell>
                                                </TableRow>
                                            )
                                        })}
                                    </TableBody>
                                </Table>
                            </div>

                            {scheduleError ? (
                                <div className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-600">
                                    {scheduleError}
                                </div>
                            ) : null}

                            <Button disabled={saveScheduleMutation.isPending} onClick={handleSaveSchedule}>
                                {saveScheduleMutation.isPending ? "Đang lưu..." : "Lưu lịch làm việc"}
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="services">
                    <Card>
                        <CardHeader>
                            <CardTitle>Dịch vụ khám và giá</CardTitle>
                            <CardDescription>
                                Cập nhật danh sách dịch vụ để bệnh nhân xem trước khi đặt lịch.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {services.length === 0 ? (
                                <div className="rounded-md border border-dashed px-4 py-3 text-sm text-muted-foreground">
                                    Chưa có dịch vụ nào. Hãy thêm dịch vụ đầu tiên.
                                </div>
                            ) : null}

                            {services.map((service, idx) => (
                                <div key={`${service.name}-${idx}`} className="grid gap-2 rounded-md border p-3 md:grid-cols-4">
                                    <Input
                                        placeholder="Tên dịch vụ"
                                        value={service.name}
                                        onChange={(e) => {
                                            const next = [...services]
                                            next[idx] = { ...next[idx], name: e.target.value }
                                            setServices(next)
                                        }}
                                    />
                                    <Input
                                        type="number"
                                        min={0}
                                        placeholder="Giá"
                                        value={service.price}
                                        onChange={(e) => {
                                            const next = [...services]
                                            next[idx] = { ...next[idx], price: Number(e.target.value) || 0 }
                                            setServices(next)
                                        }}
                                    />
                                    <Input
                                        placeholder="Tiền tệ"
                                        value={service.currency}
                                        onChange={(e) => {
                                            const next = [...services]
                                            next[idx] = { ...next[idx], currency: e.target.value }
                                            setServices(next)
                                        }}
                                    />
                                    <Button
                                        variant="outline"
                                        onClick={() => setServices(services.filter((_, i) => i !== idx))}
                                    >
                                        Xóa
                                    </Button>
                                </div>
                            ))}

                            <div className="flex flex-wrap gap-2">
                                <Button
                                    variant="outline"
                                    onClick={() =>
                                        setServices([...services, { name: "", price: 0, currency: "VND" }])
                                    }
                                >
                                    Thêm dịch vụ
                                </Button>
                                <Button
                                    disabled={saveServicesMutation.isPending || services.length === 0}
                                    onClick={() => saveServicesMutation.mutate({ services })}
                                >
                                    {saveServicesMutation.isPending ? "Đang lưu..." : "Lưu bảng giá"}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}

function BookingTable({
    items,
    renderActions,
    emptyText,
}: Readonly<{
    items: DoctorBookingItem[]
    renderActions: (item: DoctorBookingItem) => React.ReactNode
    emptyText: string
}>) {
    if (!items.length) {
        return <div className="text-sm text-muted-foreground">{emptyText}</div>
    }

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Bệnh nhân</TableHead>
                    <TableHead>Ngày khám</TableHead>
                    <TableHead>Giờ khám</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead>Thao tác</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {items.map((item) => (
                    <TableRow key={item.id}>
                        <TableCell>
                            <div className="font-medium">{item.patientName}</div>
                            <div className="text-xs text-muted-foreground">{item.patientPhone}</div>
                        </TableCell>
                        <TableCell>{formatDate(item.bookingDate)}</TableCell>
                        <TableCell>{item.bookingTime}</TableCell>
                        <TableCell>
                            <Badge
                                variant="outline"
                                className={`border ${getBookingStatusClass(item.status)}`}
                            >
                                {getBookingStatusLabel(item.status)}
                            </Badge>
                        </TableCell>
                        <TableCell>{renderActions(item)}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}

function SystemAdminSection() { // NOSONAR
    const queryClient = useQueryClient()

    const [userRoleFilter, setUserRoleFilter] = useState<RoleFilter>("ALL")
    const [userKeyword, setUserKeyword] = useState("")

    const usersQuery = useQuery({
        queryKey: ["admin", "users", userRoleFilter],
        queryFn: () => (userRoleFilter === "ALL" ? getAdminUsers() : getAdminUsers(userRoleFilter)),
    })

    const clinicsQuery = useQuery({
        queryKey: ["admin", "clinics"],
        queryFn: getAdminClinics,
    })

    const doctorsQuery = useQuery({
        queryKey: ["admin", "doctors"],
        queryFn: getAdminDoctors,
    })

    const articlesQuery = useQuery({
        queryKey: ARTICLE_QUERY_KEYS.ADMIN,
        queryFn: getAdminArticles,
    })

    const doctorUsersQuery = useQuery({
        queryKey: ["admin", "users", "doctor-only"],
        queryFn: () => getAdminUsers("DOCTOR"),
    })

    const specialtiesQuery = useQuery({
        queryKey: ["specialties"],
        queryFn: getSpecialties,
    })

    const users = usersQuery.data?.items ?? []
    const clinics = clinicsQuery.data?.items ?? []
    const doctors = doctorsQuery.data?.items ?? []
    const articles = articlesQuery.data?.items ?? []
    const doctorUsers = doctorUsersQuery.data?.items ?? []
    const specialties = (specialtiesQuery.data ?? []) as SpecialtyOption[]

    const filteredUsers = useMemo(() => {
        const keyword = userKeyword.trim().toLowerCase()
        if (!keyword) {
            return users
        }
        return users.filter((user) =>
            `${user.name} ${user.email} ${user.phone || ""}`.toLowerCase().includes(keyword),
        )
    }, [users, userKeyword])

    const [doctorAccountName, setDoctorAccountName] = useState("")
    const [doctorAccountEmail, setDoctorAccountEmail] = useState("")
    const [doctorAccountPhone, setDoctorAccountPhone] = useState("")
    const [doctorAccountPassword, setDoctorAccountPassword] = useState("")

    const [editingClinicId, setEditingClinicId] = useState<string | null>(null)
    const [clinicName, setClinicName] = useState("")
    const [clinicAddress, setClinicAddress] = useState("")
    const [clinicPhone, setClinicPhone] = useState("")
    const [clinicEmail, setClinicEmail] = useState("")
    const [clinicWebsite, setClinicWebsite] = useState("")
    const [clinicImage, setClinicImage] = useState("")
    const [clinicOpeningHours, setClinicOpeningHours] = useState("08:00 - 17:00")
    const [clinicDescription, setClinicDescription] = useState("")
    const [clinicIsOpen, setClinicIsOpen] = useState(true)

    const [editingDoctorId, setEditingDoctorId] = useState<string | null>(null)
    const [doctorName, setDoctorName] = useState("")
    const [doctorUserId, setDoctorUserId] = useState("")
    const [doctorClinicId, setDoctorClinicId] = useState("")
    const [doctorSpecialtyId, setDoctorSpecialtyId] = useState("")
    const [doctorExperience, setDoctorExperience] = useState(0)
    const [doctorAvatar, setDoctorAvatar] = useState("")
    const [doctorBio, setDoctorBio] = useState("")
    const [doctorAvailable, setDoctorAvailable] = useState(true)

    const [editingArticleId, setEditingArticleId] = useState<string | null>(null)
    const [articleTitle, setArticleTitle] = useState("")
    const [articleCategory, setArticleCategory] = useState<string>(ARTICLE_DEFAULTS.CATEGORY)
    const [articleReadTime, setArticleReadTime] = useState<string>(ARTICLE_DEFAULTS.READ_TIME)
    const [articleImage, setArticleImage] = useState("")
    const [articleDescription, setArticleDescription] = useState("")

    const createUserMutation = useMutation({
        mutationFn: createAdminUser,
        onSuccess: () => {
            setDoctorAccountName("")
            setDoctorAccountEmail("")
            setDoctorAccountPhone("")
            setDoctorAccountPassword("")
            queryClient.invalidateQueries({ queryKey: ["admin", "users"] })
        },
    })

    const deleteUserMutation = useMutation({
        mutationFn: deleteAdminUser,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin", "users"] })
        },
    })

    const toggleUserActiveMutation = useMutation({
        mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
            updateAdminUser(id, { isActive }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin", "users"] })
        },
    })

    const createClinicMutation = useMutation({
        mutationFn: createAdminClinic,
        onSuccess: () => {
            resetClinicForm()
            queryClient.invalidateQueries({ queryKey: ["admin", "clinics"] })
        },
    })

    const updateClinicMutation = useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: Parameters<typeof updateAdminClinic>[1] }) =>
            updateAdminClinic(id, payload),
        onSuccess: () => {
            resetClinicForm()
            queryClient.invalidateQueries({ queryKey: ["admin", "clinics"] })
        },
    })

    const deleteClinicMutation = useMutation({
        mutationFn: deleteAdminClinic,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin", "clinics"] })
        },
    })

    const createDoctorMutation = useMutation({
        mutationFn: createAdminDoctor,
        onSuccess: () => {
            resetDoctorForm()
            queryClient.invalidateQueries({ queryKey: ["admin", "doctors"] })
        },
    })

    const updateDoctorMutation = useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: Parameters<typeof updateAdminDoctor>[1] }) =>
            updateAdminDoctor(id, payload),
        onSuccess: () => {
            resetDoctorForm()
            queryClient.invalidateQueries({ queryKey: ["admin", "doctors"] })
        },
    })

    const deleteDoctorMutation = useMutation({
        mutationFn: deleteAdminDoctor,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin", "doctors"] })
        },
    })

    const toggleDoctorAvailabilityMutation = useMutation({
        mutationFn: ({ id, isAvailable }: { id: string; isAvailable: boolean }) =>
            updateAdminDoctor(id, { isAvailable }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin", "doctors"] })
        },
    })

    const createArticleMutation = useMutation({
        mutationFn: createAdminArticle,
        onSuccess: () => {
            resetArticleForm()
            queryClient.invalidateQueries({ queryKey: ARTICLE_QUERY_KEYS.ADMIN })
        },
    })

    const updateArticleMutation = useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: Parameters<typeof updateAdminArticle>[1] }) =>
            updateAdminArticle(id, payload),
        onSuccess: () => {
            resetArticleForm()
            queryClient.invalidateQueries({ queryKey: ARTICLE_QUERY_KEYS.ADMIN })
        },
    })

    const deleteArticleMutation = useMutation({
        mutationFn: deleteAdminArticle,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ARTICLE_QUERY_KEYS.ADMIN })
        },
    })

    function resetClinicForm() {
        setEditingClinicId(null)
        setClinicName("")
        setClinicAddress("")
        setClinicPhone("")
        setClinicEmail("")
        setClinicWebsite("")
        setClinicImage("")
        setClinicOpeningHours("08:00 - 17:00")
        setClinicDescription("")
        setClinicIsOpen(true)
    }

    function resetDoctorForm() {
        setEditingDoctorId(null)
        setDoctorName("")
        setDoctorUserId("")
        setDoctorClinicId("")
        setDoctorSpecialtyId("")
        setDoctorExperience(0)
        setDoctorAvatar("")
        setDoctorBio("")
        setDoctorAvailable(true)
    }

    function resetArticleForm() {
        setEditingArticleId(null)
        setArticleTitle("")
        setArticleCategory(ARTICLE_DEFAULTS.CATEGORY)
        setArticleReadTime(ARTICLE_DEFAULTS.READ_TIME)
        setArticleImage("")
        setArticleDescription("")
    }

    function fillClinicForm(clinic: AdminClinic) {
        setEditingClinicId(clinic.id)
        setClinicName(clinic.name)
        setClinicAddress(clinic.address)
        setClinicPhone(clinic.phone || "")
        setClinicEmail(clinic.email || "")
        setClinicWebsite(clinic.website || "")
        setClinicImage(clinic.image || "")
        setClinicOpeningHours(clinic.openingHours || "08:00 - 17:00")
        setClinicDescription(clinic.description || "")
        setClinicIsOpen(clinic.isOpen)
    }

    function fillDoctorForm(doctor: AdminDoctor) {
        setEditingDoctorId(doctor.id)
        setDoctorName(doctor.name)
        setDoctorUserId(doctor.user?.id || "")
        setDoctorClinicId(doctor.clinic.id)
        setDoctorSpecialtyId(doctor.specialty.id)
        setDoctorExperience(doctor.experience)
        setDoctorAvatar(doctor.avatar || "")
        setDoctorBio(doctor.bio || "")
        setDoctorAvailable(doctor.isAvailable)
    }

    function fillArticleForm(article: AdminArticle) {
        setEditingArticleId(article.id)
        setArticleTitle(article.title)
        setArticleCategory(article.category)
        setArticleReadTime(article.readTime)
        setArticleImage(article.image || "")
        setArticleDescription(article.description)
    }

    const totalDoctors = users.filter((user) => user.role === "DOCTOR").length
    const openClinics = clinics.filter((clinic) => clinic.isOpen).length

    let clinicSubmitLabel = "Thêm phòng khám"
    if (editingClinicId) {
        clinicSubmitLabel = updateClinicMutation.isPending ? "Đang cập nhật..." : "Cập nhật phòng khám"
    } else if (createClinicMutation.isPending) {
        clinicSubmitLabel = "Đang thêm..."
    }

    let doctorSubmitLabel = "Thêm bác sĩ"
    if (editingDoctorId) {
        doctorSubmitLabel = updateDoctorMutation.isPending ? "Đang cập nhật..." : "Cập nhật bác sĩ"
    } else if (createDoctorMutation.isPending) {
        doctorSubmitLabel = "Đang thêm..."
    }

    let articleSubmitLabel = "Thêm bài viết"
    if (editingArticleId) {
        articleSubmitLabel = updateArticleMutation.isPending ? "Đang cập nhật..." : "Cập nhật bài viết"
    } else if (createArticleMutation.isPending) {
        articleSubmitLabel = "Đang thêm..."
    }

    return (
        <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <StatCard icon={Users} title="Tổng tài khoản" value={String(users.length)} />
                <StatCard icon={Stethoscope} title="Tài khoản bác sĩ" value={String(totalDoctors)} />
                <StatCard icon={Building2} title="Phòng khám mở" value={String(openClinics)} />
                <StatCard icon={Newspaper} title="Bài cẩm nang" value={String(articles.length)} />
            </div>

            <Tabs defaultValue="users" className="space-y-4">
                <TabsList className="grid h-auto w-full grid-cols-4 gap-1 bg-muted p-1">
                    <TabsTrigger className="py-2 data-[state=active]:bg-primary data-[state=active]:text-white" value="users">
                        Người dùng
                    </TabsTrigger>
                    <TabsTrigger className="py-2 data-[state=active]:bg-primary data-[state=active]:text-white" value="clinics">
                        Phòng khám
                    </TabsTrigger>
                    <TabsTrigger className="py-2 data-[state=active]:bg-primary data-[state=active]:text-white" value="doctors">
                        Bác sĩ
                    </TabsTrigger>
                    <TabsTrigger className="py-2 data-[state=active]:bg-primary data-[state=active]:text-white" value="news">
                        Cẩm nang
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="users" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Tạo tài khoản bác sĩ</CardTitle>
                            <CardDescription>
                                Tài khoản bệnh nhân tự đăng ký ở trang người dùng. Tại đây chỉ tạo tài khoản bác sĩ.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2 md:grid-cols-4">
                                <Input
                                    value={doctorAccountName}
                                    onChange={(e) => setDoctorAccountName(e.target.value)}
                                    placeholder="Họ tên bác sĩ"
                                />
                                <Input
                                    value={doctorAccountEmail}
                                    onChange={(e) => setDoctorAccountEmail(e.target.value)}
                                    placeholder="Email đăng nhập"
                                />
                                <Input
                                    value={doctorAccountPhone}
                                    onChange={(e) => setDoctorAccountPhone(e.target.value)}
                                    placeholder="Số điện thoại"
                                />
                                <Input
                                    type="password"
                                    value={doctorAccountPassword}
                                    onChange={(e) => setDoctorAccountPassword(e.target.value)}
                                    placeholder="Mật khẩu"
                                />
                            </div>

                            <Button
                                disabled={
                                    createUserMutation.isPending ||
                                    !doctorAccountName ||
                                    !doctorAccountEmail ||
                                    !doctorAccountPassword
                                }
                                onClick={() =>
                                    createUserMutation.mutate({
                                        name: doctorAccountName,
                                        email: doctorAccountEmail,
                                        phone: doctorAccountPhone || undefined,
                                        password: doctorAccountPassword,
                                        role: "DOCTOR",
                                    })
                                }
                            >
                                {createUserMutation.isPending ? "Đang tạo..." : "Tạo tài khoản bác sĩ"}
                            </Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                            <div>
                                <CardTitle>Danh sách người dùng</CardTitle>
                                <CardDescription>Quản lý trạng thái hoạt động của tài khoản.</CardDescription>
                            </div>

                            <div className="grid w-full gap-2 md:w-[420px] md:grid-cols-2">
                                <Input
                                    value={userKeyword}
                                    onChange={(e) => setUserKeyword(e.target.value)}
                                    placeholder="Tìm theo tên, email, SĐT"
                                />
                                <Select value={userRoleFilter} onValueChange={(v) => setUserRoleFilter(v as RoleFilter)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Lọc vai trò" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="ALL">Tất cả vai trò</SelectItem>
                                        <SelectItem value="DOCTOR">Bác sĩ</SelectItem>
                                        <SelectItem value="PATIENT">Bệnh nhân</SelectItem>
                                        <SelectItem value="ADMIN">Quản trị viên</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Họ tên</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Điện thoại</TableHead>
                                        <TableHead>Vai trò</TableHead>
                                        <TableHead>Trạng thái</TableHead>
                                        <TableHead>Thao tác</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredUsers.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">
                                                Không có người dùng phù hợp.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredUsers.map((user) => (
                                            <TableRow key={user.id}>
                                                <TableCell className="font-medium">{user.name}</TableCell>
                                                <TableCell>{user.email}</TableCell>
                                                <TableCell>{user.phone || "-"}</TableCell>
                                                <TableCell>
                                                    <Badge variant="outline">{getRoleLabel(user.role)}</Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant="outline"
                                                        className={
                                                            user.isActive
                                                                ? "border-emerald-200 bg-emerald-100 text-emerald-700"
                                                                : "border-rose-200 bg-rose-100 text-rose-700"
                                                        }
                                                    >
                                                        {user.isActive ? "Đang hoạt động" : "Đã khóa"}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="space-x-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() =>
                                                            toggleUserActiveMutation.mutate({
                                                                id: user.id,
                                                                isActive: !user.isActive,
                                                            })
                                                        }
                                                    >
                                                        {user.isActive ? "Khóa" : "Mở"}
                                                    </Button>
                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={() => deleteUserMutation.mutate(user.id)}
                                                    >
                                                        Xóa
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="clinics" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                {editingClinicId ? "Cập nhật phòng khám" : "Thêm phòng khám mới"}
                            </CardTitle>
                            <CardDescription>
                                Bổ sung đủ thông tin hiển thị cho bệnh nhân: ảnh, địa chỉ, giờ hoạt động, liên hệ.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2 md:grid-cols-2">
                                <Input
                                    value={clinicName}
                                    onChange={(e) => setClinicName(e.target.value)}
                                    placeholder="Tên phòng khám"
                                />
                                <Input
                                    value={clinicAddress}
                                    onChange={(e) => setClinicAddress(e.target.value)}
                                    placeholder="Địa chỉ"
                                />
                                <Input
                                    value={clinicPhone}
                                    onChange={(e) => setClinicPhone(e.target.value)}
                                    placeholder="Số điện thoại"
                                />
                                <Input
                                    value={clinicEmail}
                                    onChange={(e) => setClinicEmail(e.target.value)}
                                    placeholder="Email"
                                />
                                <Input
                                    value={clinicWebsite}
                                    onChange={(e) => setClinicWebsite(e.target.value)}
                                    placeholder="Website"
                                />
                                <Input
                                    value={clinicOpeningHours}
                                    onChange={(e) => setClinicOpeningHours(e.target.value)}
                                    placeholder="Giờ làm việc (ví dụ: 08:00 - 17:00)"
                                />
                                <Input
                                    value={clinicImage}
                                    onChange={(e) => setClinicImage(e.target.value)}
                                    placeholder="Link ảnh đại diện phòng khám"
                                />
                                <div className="flex items-center gap-2 rounded-md border px-3">
                                    <Switch checked={clinicIsOpen} onCheckedChange={setClinicIsOpen} />
                                    <span className="text-sm">Phòng khám đang mở</span>
                                </div>
                            </div>

                            <Textarea
                                value={clinicDescription}
                                onChange={(e) => setClinicDescription(e.target.value)}
                                placeholder="Mô tả ngắn phòng khám"
                            />

                            <div className="flex flex-wrap gap-2">
                                <Button
                                    disabled={
                                        (!editingClinicId && createClinicMutation.isPending) ||
                                        (editingClinicId !== null && updateClinicMutation.isPending) ||
                                        !clinicName ||
                                        !clinicAddress
                                    }
                                    onClick={() => {
                                        const payload = {
                                            name: clinicName,
                                            address: clinicAddress,
                                            description: clinicDescription || undefined,
                                            phone: clinicPhone || undefined,
                                            email: clinicEmail || undefined,
                                            website: clinicWebsite || undefined,
                                            image: clinicImage || undefined,
                                            openingHours: clinicOpeningHours || undefined,
                                            isOpen: clinicIsOpen,
                                        }

                                        if (editingClinicId) {
                                            updateClinicMutation.mutate({ id: editingClinicId, payload })
                                            return
                                        }

                                        createClinicMutation.mutate(payload)
                                    }}
                                >
                                    {clinicSubmitLabel}
                                </Button>

                                {editingClinicId ? (
                                    <Button variant="outline" onClick={resetClinicForm}>
                                        Hủy chỉnh sửa
                                    </Button>
                                ) : null}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Danh sách phòng khám</CardTitle>
                            <CardDescription>
                                Bật/tắt hoạt động, chỉnh sửa thông tin hoặc xóa phòng khám.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Ảnh</TableHead>
                                        <TableHead>Tên phòng khám</TableHead>
                                        <TableHead>Liên hệ</TableHead>
                                        <TableHead>Giờ hoạt động</TableHead>
                                        <TableHead>Trạng thái</TableHead>
                                        <TableHead>Thao tác</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {clinics.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">
                                                Chưa có phòng khám nào.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        clinics.map((clinic) => (
                                            <TableRow key={clinic.id}>
                                                <TableCell>
                                                    {clinic.image ? (
                                                        // eslint-disable-next-line @next/next/no-img-element
                                                        <img
                                                            src={clinic.image}
                                                            alt={clinic.name}
                                                            className="h-12 w-12 rounded-md object-cover"
                                                        />
                                                    ) : (
                                                        <div className="flex h-12 w-12 items-center justify-center rounded-md border bg-slate-50 text-slate-400">
                                                            <ImageIcon className="h-4 w-4" />
                                                        </div>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="font-medium">{clinic.name}</div>
                                                    <div className="text-xs text-muted-foreground">{clinic.address}</div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="text-sm">{clinic.phone || "-"}</div>
                                                    <div className="text-xs text-muted-foreground">{clinic.email || "-"}</div>
                                                </TableCell>
                                                <TableCell>{clinic.openingHours || "-"}</TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant="outline"
                                                        className={
                                                            clinic.isOpen
                                                                ? "border-emerald-200 bg-emerald-100 text-emerald-700"
                                                                : "border-slate-200 bg-slate-100 text-slate-700"
                                                        }
                                                    >
                                                        {clinic.isOpen ? "Đang mở" : "Đóng"}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="space-x-2">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => fillClinicForm(clinic)}
                                                    >
                                                        Sửa
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() =>
                                                            updateClinicMutation.mutate({
                                                                id: clinic.id,
                                                                payload: { isOpen: !clinic.isOpen },
                                                            })
                                                        }
                                                    >
                                                        {clinic.isOpen ? "Đóng" : "Mở"}
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="destructive"
                                                        onClick={() => deleteClinicMutation.mutate(clinic.id)}
                                                    >
                                                        Xóa
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="doctors" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>{editingDoctorId ? "Cập nhật hồ sơ bác sĩ" : "Thêm hồ sơ bác sĩ"}</CardTitle>
                            <CardDescription>
                                Hồ sơ bác sĩ gồm tài khoản, chuyên khoa, phòng khám, ảnh đại diện, mô tả kinh nghiệm.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2 md:grid-cols-2">
                                <Input
                                    value={doctorName}
                                    onChange={(e) => setDoctorName(e.target.value)}
                                    placeholder="Tên bác sĩ"
                                />

                                <Select value={doctorUserId} onValueChange={setDoctorUserId}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Liên kết tài khoản doctor" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {doctorUsers.map((user) => (
                                            <SelectItem key={user.id} value={user.id}>
                                                {user.email}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                <Select value={doctorClinicId} onValueChange={setDoctorClinicId}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Chọn phòng khám" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {clinics.map((clinic) => (
                                            <SelectItem key={clinic.id} value={clinic.id}>
                                                {clinic.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                <Select value={doctorSpecialtyId} onValueChange={setDoctorSpecialtyId}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Chọn chuyên khoa" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {specialties.map((specialty) => (
                                            <SelectItem key={specialty.id} value={specialty.id}>
                                                {specialty.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                <Input
                                    type="number"
                                    min={0}
                                    value={doctorExperience}
                                    onChange={(e) => setDoctorExperience(Number(e.target.value) || 0)}
                                    placeholder="Số năm kinh nghiệm"
                                />

                                <Input
                                    value={doctorAvatar}
                                    onChange={(e) => setDoctorAvatar(e.target.value)}
                                    placeholder="Link ảnh đại diện bác sĩ"
                                />
                            </div>

                            <Textarea
                                value={doctorBio}
                                onChange={(e) => setDoctorBio(e.target.value)}
                                placeholder="Giới thiệu bác sĩ"
                            />

                            <div className="flex items-center gap-2">
                                <Switch checked={doctorAvailable} onCheckedChange={setDoctorAvailable} />
                                <span className="text-sm">Sẵn sàng nhận khám</span>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                <Button
                                    disabled={
                                        (!editingDoctorId && createDoctorMutation.isPending) ||
                                        (editingDoctorId !== null && updateDoctorMutation.isPending) ||
                                        !doctorName ||
                                        !doctorClinicId ||
                                        !doctorSpecialtyId
                                    }
                                    onClick={() => {
                                        const payload = {
                                            name: doctorName,
                                            userId: doctorUserId || undefined,
                                            clinicId: doctorClinicId,
                                            specialtyId: doctorSpecialtyId,
                                            experience: doctorExperience,
                                            avatar: doctorAvatar || undefined,
                                            bio: doctorBio || undefined,
                                            isAvailable: doctorAvailable,
                                        }

                                        if (editingDoctorId) {
                                            updateDoctorMutation.mutate({ id: editingDoctorId, payload })
                                            return
                                        }

                                        createDoctorMutation.mutate(payload)
                                    }}
                                >
                                    {doctorSubmitLabel}
                                </Button>

                                {editingDoctorId ? (
                                    <Button variant="outline" onClick={resetDoctorForm}>
                                        Hủy chỉnh sửa
                                    </Button>
                                ) : null}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Danh sách bác sĩ</CardTitle>
                            <CardDescription>Quản lý hồ sơ, chuyên khoa, phòng khám và trạng thái khám.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Ảnh</TableHead>
                                        <TableHead>Bác sĩ</TableHead>
                                        <TableHead>Phòng khám</TableHead>
                                        <TableHead>Chuyên khoa</TableHead>
                                        <TableHead>Kinh nghiệm</TableHead>
                                        <TableHead>Trạng thái</TableHead>
                                        <TableHead>Thao tác</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {doctors.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={7} className="py-8 text-center text-muted-foreground">
                                                Chưa có hồ sơ bác sĩ.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        doctors.map((doctor) => (
                                            <TableRow key={doctor.id}>
                                                <TableCell>
                                                    {doctor.avatar ? (
                                                        // eslint-disable-next-line @next/next/no-img-element
                                                        <img
                                                            src={doctor.avatar}
                                                            alt={doctor.name}
                                                            className="h-12 w-12 rounded-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="flex h-12 w-12 items-center justify-center rounded-full border bg-slate-50 text-slate-400">
                                                            <Stethoscope className="h-4 w-4" />
                                                        </div>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="font-medium">{doctor.name}</div>
                                                    <div className="text-xs text-muted-foreground">{doctor.user?.email || "Chưa liên kết account"}</div>
                                                </TableCell>
                                                <TableCell>{doctor.clinic.name}</TableCell>
                                                <TableCell>{doctor.specialty.name}</TableCell>
                                                <TableCell>{doctor.experience} năm</TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant="outline"
                                                        className={
                                                            doctor.isAvailable
                                                                ? "border-emerald-200 bg-emerald-100 text-emerald-700"
                                                                : "border-slate-200 bg-slate-100 text-slate-700"
                                                        }
                                                    >
                                                        {doctor.isAvailable ? "Sẵn sàng" : "Tạm nghỉ"}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="space-x-2">
                                                    <Button size="sm" variant="outline" onClick={() => fillDoctorForm(doctor)}>
                                                        Sửa
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() =>
                                                            toggleDoctorAvailabilityMutation.mutate({
                                                                id: doctor.id,
                                                                isAvailable: !doctor.isAvailable,
                                                            })
                                                        }
                                                    >
                                                        {doctor.isAvailable ? "Tạm nghỉ" : "Mở khám"}
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="destructive"
                                                        onClick={() => deleteDoctorMutation.mutate(doctor.id)}
                                                    >
                                                        Xóa
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="news" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>{editingArticleId ? "Cập nhật bài cẩm nang" : "Thêm bài cẩm nang"}</CardTitle>
                            <CardDescription>
                                Bài viết cẩm nang để bệnh nhân đọc trước/sau khi đặt lịch khám.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2 md:grid-cols-2">
                                <Input
                                    value={articleTitle}
                                    onChange={(e) => setArticleTitle(e.target.value)}
                                    placeholder="Tiêu đề"
                                />
                                <Input
                                    value={articleCategory}
                                    onChange={(e) => setArticleCategory(e.target.value)}
                                    placeholder="Chuyên mục"
                                />
                                <Input
                                    value={articleReadTime}
                                    onChange={(e) => setArticleReadTime(e.target.value)}
                                    placeholder="Thời gian đọc (ví dụ: 5 phút)"
                                />
                                <Input
                                    value={articleImage}
                                    onChange={(e) => setArticleImage(e.target.value)}
                                    placeholder="Link ảnh đại diện bài viết"
                                />
                            </div>

                            <Textarea
                                value={articleDescription}
                                onChange={(e) => setArticleDescription(e.target.value)}
                                placeholder="Mô tả nội dung"
                            />

                            <div className="flex flex-wrap gap-2">
                                <Button
                                    disabled={
                                        (!editingArticleId && createArticleMutation.isPending) ||
                                        (editingArticleId !== null && updateArticleMutation.isPending) ||
                                        !articleTitle ||
                                        !articleDescription
                                    }
                                    onClick={() => {
                                        const payload = {
                                            title: articleTitle,
                                            description: articleDescription,
                                            category: articleCategory || undefined,
                                            readTime: articleReadTime || undefined,
                                            image: articleImage || undefined,
                                        }

                                        if (editingArticleId) {
                                            updateArticleMutation.mutate({ id: editingArticleId, payload })
                                            return
                                        }

                                        createArticleMutation.mutate(payload)
                                    }}
                                >
                                    {articleSubmitLabel}
                                </Button>

                                {editingArticleId ? (
                                    <Button variant="outline" onClick={resetArticleForm}>
                                        Hủy chỉnh sửa
                                    </Button>
                                ) : null}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Danh sách cẩm nang</CardTitle>
                            <CardDescription>Quản lý nội dung cẩm nang sức khỏe trên website.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Ảnh</TableHead>
                                        <TableHead>Tiêu đề</TableHead>
                                        <TableHead>Chuyên mục</TableHead>
                                        <TableHead>Thời gian đọc</TableHead>
                                        <TableHead>Ngày đăng</TableHead>
                                        <TableHead>Thao tác</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {articles.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">
                                                Chưa có bài viết nào.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        articles.map((article) => (
                                            <TableRow key={article.id}>
                                                <TableCell>
                                                    {article.image ? (
                                                        // eslint-disable-next-line @next/next/no-img-element
                                                        <img
                                                            src={article.image}
                                                            alt={article.title}
                                                            className="h-12 w-16 rounded-md object-cover"
                                                        />
                                                    ) : (
                                                        <div className="flex h-12 w-16 items-center justify-center rounded-md border bg-slate-50 text-slate-400">
                                                            <Newspaper className="h-4 w-4" />
                                                        </div>
                                                    )}
                                                </TableCell>
                                                <TableCell className="font-medium">{article.title}</TableCell>
                                                <TableCell>{article.category}</TableCell>
                                                <TableCell>{article.readTime}</TableCell>
                                                <TableCell>{formatDate(article.publishedAt)}</TableCell>
                                                <TableCell className="space-x-2">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => fillArticleForm(article)}
                                                    >
                                                        Sửa
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="destructive"
                                                        onClick={() => deleteArticleMutation.mutate(article.id)}
                                                    >
                                                        Xóa
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            <Card className="border-primary/20 bg-primary/5">
                <CardHeader>
                    <CardTitle>Tóm tắt vận hành</CardTitle>
                    <CardDescription>
                        Gợi ý luồng: tạo tài khoản doctor ở tab Users, sau đó tạo hồ sơ chuyên môn ở tab Doctors.
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-3">
                    <div className="rounded-lg border bg-white p-4">
                        <p className="mb-1 text-sm font-semibold">1. Tài khoản bác sĩ</p>
                        <p className="text-sm text-muted-foreground">
                            Tạo email/mật khẩu để bác sĩ đăng nhập vào trang quản trị.
                        </p>
                    </div>
                    <div className="rounded-lg border bg-white p-4">
                        <p className="mb-1 text-sm font-semibold">2. Hồ sơ bác sĩ</p>
                        <p className="text-sm text-muted-foreground">
                            Gán bác sĩ vào phòng khám + chuyên khoa + ảnh đại diện + thông tin kinh nghiệm.
                        </p>
                    </div>
                    <div className="rounded-lg border bg-white p-4">
                        <p className="mb-1 text-sm font-semibold">3. Bác sĩ nhận lịch</p>
                        <p className="text-sm text-muted-foreground">
                            Bác sĩ xác nhận lịch chờ và thiết lập lịch làm việc/giá dịch vụ trực tiếp trong tài khoản của họ.
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

function StatCard({
    icon: Icon,
    title,
    value,
}: Readonly<{
    icon: typeof Users
    title: string
    value: string
}>) {
    return (
        <Card className="border-primary/15 bg-white shadow-sm">
            <CardContent className="flex items-center justify-between py-4">
                <div>
                    <p className="text-sm text-muted-foreground">{title}</p>
                    <p className="text-2xl font-semibold text-slate-800">{value}</p>
                </div>
                <div className="rounded-lg bg-primary/10 p-2 text-primary">
                    <Icon className="h-5 w-5" />
                </div>
            </CardContent>
        </Card>
    )
}
