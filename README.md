# Healthcare Booking System

Hệ thống đặt lịch khám bệnh — kiến trúc **Microservices Monorepo** với NestJS, Next.js, PostgreSQL và Redis.

---

## Kiến trúc hệ thống

```
healthcare/
├── frontend/               # Next.js 14 (App Router) — cổng 3000
├── backend/                # NestJS Monorepo
│   ├── apps/
│   │   ├── auth/           # Auth Service — cổng 3001
│   │   ├── backend/        # Backend Service (API chính) — cổng 8080
│   │   └── admin/          # Admin Service — cổng 3002
│   ├── libs/
│   │   ├── common/         # Thư viện dùng chung (guards, decorators, redis, mail...)
│   │   └── database/       # DatabaseModule (PrismaClient wrapper)
│   ├── src/                # Business modules gốc (users, clinics, doctors, bookings...)
│   └── prisma/             # Schema & migrations
├── database/               # Scripts khởi tạo DB (nếu có)
├── docker-compose.yaml     # Stack đầy đủ (production-like)
└── docker-compose.yml      # Stack dev đơn giản (chỉ postgres + redis)
```

### Các service & port

| Service          | Port | Mô tả                                 |
|-----------------|------|---------------------------------------|
| **frontend**    | 3000 | Giao diện người dùng (Next.js)        |
| **auth-service**| 3001 | Đăng ký / đăng nhập / OTP email      |
| **backend-service** | 8080 | API chính (clinics, doctors, bookings...) |
| **admin-service**| 3002 | Quản trị (admin, doctor-admin)        |
| **PostgreSQL**  | 5432 | Cơ sở dữ liệu                         |
| **Redis**       | 6379 | Cache / OTP session                   |

### Công nghệ sử dụng

| Layer     | Stack |
|-----------|-------|
| Frontend  | Next.js 14, React Query, Zustand, Axios |
| Backend   | NestJS 11, Prisma 7, PostgreSQL 15, Redis 7 |
| Auth      | JWT Bearer token, Bcrypt, OTP qua Email (Nodemailer) |
| API Docs  | Swagger (`/docs` trên mỗi service)       |
| Container | Docker, Docker Compose, pnpm             |

---

## Cách 1: Chạy local (Development)

### Yêu cầu
- Node.js >= 20
- pnpm >= 10 (`npm i -g pnpm`)
- Docker Desktop (để chạy PostgreSQL + Redis)

### Bước 1 — Khởi động PostgreSQL + Redis

```bash
# Tại thư mục root
docker-compose -f docker-compose.yml up -d
```

### Bước 2 — Cấu hình Backend

```bash
cd backend

# Copy file env
cp .env.example .env
```

Chỉnh sửa `backend/.env`:

```env
NODE_ENV=development
PORT=8080
AUTH_PORT=3001
ADMIN_PORT=3002

DATABASE_URL=postgresql://postgres:postgres@localhost:5432/healthcare?schema=public
REDIS_URL=redis://localhost:6379

JWT_SECRET=dev-secret-change-me
JWT_EXPIRATION=7d

CORS_ORIGIN=http://localhost:3000

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM="Healthcare Support <your-email@gmail.com>"

REGISTER_OTP_TTL_SECONDS=300
```

### Bước 3 — Setup Database & cài dependencies Backend

```bash
cd backend

# Cài dependencies
pnpm install

# Tạo Prisma client
pnpm prisma:generate

# Chạy migration
pnpm prisma:migrate

# (Tuỳ chọn) Seed dữ liệu mẫu
pnpm prisma db seed
```

### Bước 4 — Chạy các Backend Service

Mở **3 terminal riêng biệt** tại `backend/`:

```bash
# Terminal 1 — Auth Service (port 3001)
pnpm nest start auth --watch

# Terminal 2 — Backend Service (port 8080)
pnpm nest start backend --watch

# Terminal 3 — Admin Service (port 3002)
pnpm nest start admin --watch
```

### Bước 5 — Cấu hình & chạy Frontend

```bash
cd frontend
```

Tạo file `frontend/.env.local`:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
NEXT_PUBLIC_AUTH_BASE_URL=http://localhost:3001
NEXT_PUBLIC_ADMIN_BASE_URL=http://localhost:3002
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=HealthCare
```

```bash
# Cài dependencies
pnpm install

# Chạy dev server
pnpm dev
```

### Kiểm tra hoạt động

| URL | Mô tả |
|-----|-------|
| http://localhost:3000 | Frontend |
| http://localhost:8080/docs | Swagger — Backend API |
| http://localhost:3001/docs | Swagger — Auth API |
| http://localhost:3002/docs | Swagger — Admin API |

---

## Cách 2: Chạy bằng Docker Compose (Production-like)

### Yêu cầu
- Docker Desktop

### Bước 1 — Cấu hình SMTP (bắt buộc nếu dùng tính năng OTP)

Tạo file `.env` tại thư mục root:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

> **Lưu ý:** Nếu không cần OTP email, có thể bỏ qua — các biến này có giá trị mặc định rỗng.

### Bước 2 — Build & chạy toàn bộ stack

```bash
# Tại thư mục root
docker-compose -f docker-compose.yaml up --build
```

> Lần đầu build mất khoảng **3–5 phút** do cài dependencies và compile TypeScript.

### Bước 3 — Chạy Database Migration

Sau khi các container đã up, chạy migration vào container backend:

```bash
docker exec -it healthcare-backend sh -c "npx prisma migrate deploy"
```

### Dừng stack

```bash
docker-compose -f docker-compose.yaml down

# Dừng và xoá toàn bộ data (volumes)
docker-compose -f docker-compose.yaml down -v
```

### Kiểm tra hoạt động

| URL | Mô tả |
|-----|-------|
| http://localhost:3000 | Frontend |
| http://localhost:8080/docs | Swagger — Backend API |
| http://localhost:3001/docs | Swagger — Auth API |
| http://localhost:3002/docs | Swagger — Admin API |

---

## API Reference

### Auth Service — `http://localhost:3001/v1`

| Method | Endpoint | Auth | Mô tả |
|--------|----------|------|-------|
| POST | `/auth/register` | Public | Gửi OTP đăng ký |
| POST | `/auth/verify-register-otp` | Public | Xác nhận OTP, tạo tài khoản |
| POST | `/auth/login` | Public | Đăng nhập, nhận JWT |

### Backend Service — `http://localhost:8080/v1`

| Method | Endpoint | Auth | Mô tả |
|--------|----------|------|-------|
| GET | `/health` | Public | Health check |
| GET | `/clinics` | Public | Danh sách phòng khám |
| GET | `/clinics/:id` | Public | Chi tiết phòng khám |
| GET | `/doctors` | Public | Danh sách bác sĩ |
| GET | `/specialties` | Public | Danh sách chuyên khoa |
| GET | `/users/me` | 🔒 JWT | Thông tin người dùng |
| POST | `/bookings` | 🔒 JWT | Tạo lịch hẹn |
| GET | `/bookings/me` | 🔒 JWT | Lịch hẹn của tôi |

### Admin Service — `http://localhost:3002/v1`

| Method | Endpoint | Auth | Mô tả |
|--------|----------|------|-------|
| GET | `/admin/users` | 🔒 ADMIN | Quản lý người dùng |
| GET | `/admin/bookings` | 🔒 ADMIN | Quản lý đặt lịch |
| * | `/doctor-admin/*` | 🔒 DOCTOR | Quản lý bác sĩ |

---

## Lệnh hữu ích

```bash
# Xem logs một service cụ thể (Docker)
docker logs healthcare-backend -f
docker logs healthcare-auth -f
docker logs healthcare-admin -f

# Build riêng từng service (local)
cd backend
pnpm nest build auth
pnpm nest build backend
pnpm nest build admin

# Prisma Studio (xem/sửa data trực quan)
cd backend && pnpm prisma:studio

# Xem Prisma schema
cat backend/prisma/schema.prisma
```
