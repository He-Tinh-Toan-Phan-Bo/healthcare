# healthcare

Monorepo **Healthcare** gồm:
- **Frontend**: Next.js (App Router)
- **Backend**: NestJS (REST API) + Swagger
- **Database**: PostgreSQL + Prisma ORM

## Công nghệ

### Frontend (`frontend/`)
- **Next.js** + React
- **@tanstack/react-query** (data fetching/cache)
- **axios** (API client)
- **zustand** (auth state)
- UI hiện có theo bộ component trong `src/shared/ui/*`

### Backend (`backend/`)
- **NestJS** (versioning `/v1`)
- **Prisma** + **PostgreSQL**
- **JWT auth** (Bearer token)
- Swagger tại `GET /docs`

### Database
- PostgreSQL chạy qua Docker Compose (`postgres:16`)

## API backend hiện có

Base URL mặc định: `http://localhost:8080/v1`

### Public
- **GET** `/v1/health`
- **POST** `/v1/auth/register`
- **POST** `/v1/auth/login`
- **GET** `/v1/clinics` (query: `q`, `page`, `limit`)
- **GET** `/v1/clinics/:id`
- **GET** `/v1/doctors` (query: `clinicId`, `specialtyId`, `q`)
- **GET** `/v1/specialties`

### Require JWT (Bearer)
- **GET** `/v1/users/me`
- **POST** `/v1/bookings`
- **GET** `/v1/bookings/me`

## Cấu hình môi trường

### Root `.env` (Docker Compose)
File: `.env`
- `POSTGRES_DB` (mặc định `healthcare`)
- `POSTGRES_USER` (mặc định `postgres`)
- `POSTGRES_PASSWORD` (mặc định `postgres`)

### Backend env
File: `backend/.env`
- `PORT=8080`
- `DATABASE_URL=postgresql://postgres:postgres@localhost:5432/healthcare?schema=public`
- `JWT_SECRET=dev-secret-change-me`
- `JWT_EXPIRATION=7d`
- `CORS_ORIGIN=http://localhost:3000`

### Frontend env
File: `frontend/.env.local`
- `NEXT_PUBLIC_API_BASE_URL=http://localhost:8080`

## Cách chạy dự án

### 1) Chạy PostgreSQL bằng Docker
Tại thư mục root:
- Start DB: `docker compose up -d`
- Stop DB: `docker compose down`

### 2) Chạy Backend
Tại `backend/`:
- Cài deps: `pnpm i`
- Generate Prisma client: `pnpm prisma:generate`
- (Khuyến nghị) tạo migration/dev db: `pnpm prisma:migrate`
- Run dev: `pnpm start:dev`

Swagger:
- `http://localhost:8080/docs`

### 3) Chạy Frontend
Tại `frontend/`:
- Cài deps: `pnpm i`
- Run dev: `pnpm dev`

Mở:
- `http://localhost:3000`

## Test nhanh (end-to-end)
- **Register**: `POST /v1/auth/register` → nhận `accessToken`
- **Login**: `POST /v1/auth/login` → nhận `accessToken`
- FE sẽ tự lưu token vào session storage và gắn `Authorization: Bearer <token>` cho các API cần auth.
- **Clinics**: vào `/clinics` để fetch `GET /v1/clinics`
- **Booking**: vào `/booking` và tạo booking qua `POST /v1/bookings`

