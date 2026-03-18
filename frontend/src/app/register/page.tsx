"use client"

import { useState } from "react"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { Button } from "@/shared/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/shared/ui/card"
import { Input } from "@/shared/ui/input"
import { Label } from "@/shared/ui/label"
import { Calendar } from "lucide-react"
import Link from "next/link"
import { useMutation } from "@tanstack/react-query"
import { postRegister } from "@/api/auth"
import { useAuthStore } from "@/store"
import { useRouter } from "next/navigation"

export default function RegisterPage() {
  const router = useRouter()
  const auth = useAuthStore()

  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const registerMutation = useMutation({
    mutationFn: postRegister,
    onSuccess: (data) => {
      auth.login(data.user, data.accessToken)
      router.push("/account")
    },
  })

  const passwordMismatch = password && confirmPassword && password !== confirmPassword

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex flex-1 items-center justify-center bg-muted/30 py-12">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-md">
            <div className="mb-6 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary">
                <Calendar className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold">Đăng Ký</h1>
              <p className="text-muted-foreground">Tạo tài khoản để bắt đầu đặt lịch khám</p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Tạo tài khoản mới</CardTitle>
                <CardDescription>Nhập thông tin của bạn để đăng ký</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullname">Họ và Tên</Label>
                  <Input id="fullname" placeholder="Nguyễn Văn A" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Số Điện Thoại</Label>
                  <Input id="phone" type="tel" placeholder="0912345678" value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="email@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Mật khẩu</Label>
                  <Input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Xác nhận Mật khẩu</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
                {passwordMismatch && (
                  <div className="text-sm text-destructive">Mật khẩu xác nhận không khớp.</div>
                )}
                {registerMutation.isError && (
                  <div className="text-sm text-destructive">Đăng ký thất bại. Vui lòng thử lại.</div>
                )}
              </CardContent>
              <CardFooter className="flex flex-col gap-4">
                <Button
                  className="w-full bg-primary"
                  disabled={
                    registerMutation.isPending ||
                    !name ||
                    !email ||
                    !password ||
                    passwordMismatch
                  }
                  onClick={() =>
                    registerMutation.mutate({
                      name,
                      email,
                      phone: phone || undefined,
                      password,
                    })
                  }
                >
                  {registerMutation.isPending ? "Đang đăng ký..." : "Đăng Ký"}
                </Button>
                <p className="text-center text-sm text-muted-foreground">
                  Đã có tài khoản?{" "}
                  <Link href="/login" className="text-primary hover:underline">
                    Đăng nhập
                  </Link>
                </p>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
