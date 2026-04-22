# Dockerfile cho NestJS Microservices
FROM node:20-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
WORKDIR /app
COPY . .

FROM base AS builder
ARG APP_NAME
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm prisma:generate
RUN pnpm nest build ${APP_NAME}

FROM node:20-alpine AS runner
ARG APP_NAME
WORKDIR /app
COPY --from=builder /app/dist/apps/${APP_NAME} ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Copy thêm thư mục prisma để có thể chạy migration/seed trong container
COPY --from=builder /app/prisma ./prisma 

EXPOSE 8080 3001 3002
CMD ["node", "dist/main"]
