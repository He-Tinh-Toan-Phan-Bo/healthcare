# Giai đoạn 1: Cài đặt dependencies
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN corepack enable && pnpm install --frozen-lockfile

# Giai đoạn 2: Build code
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN corepack enable && pnpm build

# Giai đoạn 3: Chạy ứng dụng (Image cuối cùng)
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
# Next.js thu thập dữ liệu ẩn danh, tắt đi cho nhẹ
ENV NEXT_TELEMETRY_DISABLED=1

# Copy các file cần thiết từ bản build
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
ENV PORT=3000

# Chạy trực tiếp bằng node để ổn định nhất trên K8s
CMD ["node", "server.js"]