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
import { postLogin } from "@/api/auth"
import { useAuthStore } from "@/store"
import { useRouter, useSearchParams } from "next/navigation"

function normalizeRole(role?: string) {
  const normalized = String(role || "").toUpperCase()
  if (normalized === "SUPER_ADMIN") {
    return "ADMIN"
  }
  return normalized
}

function resolveLoginRedirect(role: string, nextPath: string | null) {
  const safeNext = nextPath?.startsWith("/") ? nextPath : null

  if (safeNext?.startsWith("/admin")) {
    return "/admin"
  }

  if (role === "ADMIN" || role === "DOCTOR") {
    return safeNext ?? "/admin"
  }

  return safeNext ?? "/account"
}

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const auth = useAuthStore()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const loginMutation = useMutation({
    mutationFn: postLogin,
    onSuccess: (data) => {
      auth.login(data.user, data.accessToken)
      const normalizedRole = normalizeRole(data.user.role)
      const nextPath = searchParams.get("next")
      const redirectTo = resolveLoginRedirect(normalizedRole, nextPath)
      router.replace(redirectTo)
    },
  })

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
              <h1 className="text-2xl font-bold">Đăng Nhập</h1>
              <p className="text-muted-foreground">Đăng nhập để quản lý lịch khám của bạn</p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Chào mừng trở lại</CardTitle>
                <CardDescription>Nhập thông tin đăng nhập của bạn</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Mật khẩu</Label>
                    <Link href="#" className="text-sm text-primary hover:underline">
                      Quên mật khẩu?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                {loginMutation.isError && (
                  <div className="text-sm text-destructive">
                    Đăng nhập thất bại. Vui lòng kiểm tra email/mật khẩu.
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex flex-col gap-4">
                <Button
                  className="w-full bg-primary"
                  disabled={loginMutation.isPending || !email || !password}
                  onClick={() => loginMutation.mutate({ email, password })}
                >
                  {loginMutation.isPending ? "Đang đăng nhập..." : "Đăng Nhập"}
                </Button>
                <p className="text-center text-sm text-muted-foreground">
                  Chưa có tài khoản?{" "}
                  <Link href="/register" className="text-primary hover:underline">
                    Đăng ký ngay
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
