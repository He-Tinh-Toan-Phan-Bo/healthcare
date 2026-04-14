# 🚀 Migration Checklist - Feature-Sliced Design

> **Start Date:** December 29, 2025  
> **Target:** Refactor clinic-booking-ui to FSD architecture

---

## Phase 1: Cấu Trúc Cơ Bản ✅

### 1.1 Tạo src/ folder structure
- [x] Tạo `src/` folder
- [x] Tạo `src/shared/` với các subfolder:
  - [x] `src/shared/ui/`
  - [x] `src/shared/hooks/`
  - [x] `src/shared/lib/`
  - [x] `src/shared/types/`
  - [x] `src/shared/constants/`
  - [x] `src/shared/config/`
  - [x] `src/shared/i18n/`
  - [x] `src/shared/layouts/`
  - [x] `src/shared/provider/`
  - [x] `src/shared/utils/`
  - [x] `src/shared/assets/`
- [x] Tạo `src/store/`
- [x] Tạo `src/components/` (global components)

### 1.2 Di chuyển files hiện tại
- [x] Move `app/` → `src/app/`
- [x] Move `components/ui/` → `src/shared/ui/`
- [x] Move `components/shared/` → `src/shared/components/`
- [x] Move `components/header.tsx` → `src/components/Header.tsx`
- [x] Move `components/footer.tsx` → `src/components/Footer.tsx`
- [x] Move `lib/` → `src/shared/lib/`
- [x] Move `hooks/` → `src/shared/hooks/`
- [x] Move `types/` → `src/shared/types/`
- [x] Move `constants/` → `src/shared/constants/`
- [x] Move `config/` → `src/shared/config/`
- [x] Move `styles/` → `src/styles/`

### 1.3 Cập nhật tsconfig.json
- [x] Cập nhật paths aliases cho src/
- [x] Cập nhật baseUrl

---

## Phase 2: Feature Modules ✅

### 2.1 Tạo feature structure
- [x] Tạo `src/features/auth/`
  - [x] `components/`
  - [x] `hooks/`
  - [x] `services/`
  - [x] `types/`
  - [x] `constants/`
  - [x] `utils/`
  - [x] `index.ts`
- [x] Tạo `src/features/clinics/`
- [x] Tạo `src/features/booking/`
- [x] Tạo `src/features/health-guide/`
- [x] Tạo `src/features/account/`
- [x] Tạo `src/features/home/`

### 2.2 Di chuyển services
- [x] Move `services/clinicService.ts` → `src/features/clinics/services/`
- [x] Move `services/bookingService.ts` → `src/features/booking/services/`
- [x] Move `services/packageService.ts` → `src/features/clinics/services/`
- [x] Move `services/articleService.ts` → `src/features/health-guide/services/`

### 2.3 Di chuyển feature components
- [x] Move `features/home/` → `src/features/home/`
- [ ] Tách components theo feature

---

## Phase 3: Data Fetching & State ✅

### 3.1 Setup React Query
- [x] Install `@tanstack/react-query`
- [x] Tạo `src/shared/provider/QueryProvider.tsx`
- [x] Tạo `src/shared/lib/baseApi.ts` (Axios instance)
- [ ] Wrap app với QueryClientProvider

### 3.2 Setup Zustand
- [x] Install `zustand`
- [x] Tạo `src/store/authStore.ts`
- [x] Tạo `src/store/uiStore.ts`

### 3.3 Migrate hooks
- [ ] Replace `useFetch` với `useQuery`
- [ ] Tạo feature-specific hooks

---

## Phase 4: Forms & Validation ✅

### 4.1 Setup Zod
- [x] Install `zod` và `@hookform/resolvers`
- [ ] Tạo validation schemas

---

## Phase 5: i18n ✅

### 5.1 Setup react-i18next
- [x] Install `react-i18next` và `i18next`
- [x] Tạo `src/shared/i18n/config.ts`
- [x] Tạo `src/shared/i18n/locales/vi.json`
- [x] Tạo `src/shared/i18n/locales/en.json`

---

## Phase 6: Testing & Quality ✅

### 6.1 Setup Jest
- [x] Install Jest + Testing Library
- [x] Tạo `jest.config.ts`
- [x] Tạo `jest.setup.ts`

### 6.2 Setup Husky
- [x] Install Husky + lint-staged
- [x] Setup pre-commit hooks

---

## Phase 7: Documentation ✅

- [x] Tạo `.github/copilot-instructions.md`
- [ ] Cập nhật `PROJECT_STRUCTURE.md`
- [ ] Cập nhật `README.md`

---

## 📊 Progress Summary

| Phase | Status | Progress |
|-------|--------|----------|
| Phase 1: Cấu Trúc Cơ Bản | ✅ Completed | 100% |
| Phase 2: Feature Modules | ✅ Completed | 100% |
| Phase 3: Data Fetching | ✅ Completed | 90% |
| Phase 4: Forms & Validation | ✅ Completed | 80% |
| Phase 5: i18n | ✅ Completed | 100% |
| Phase 6: Testing | ✅ Completed | 100% |
| Phase 7: Documentation | 🔄 In Progress | 50% |

---

## 🧹 Cleanup Tasks ✅

- [x] Xóa folder cũ `app/` (đã move vào `src/app/`)
- [x] Xóa folder cũ `components/` (đã move vào `src/`)
- [x] Xóa folder cũ `lib/` (đã move vào `src/shared/lib/`)
- [x] Xóa folder cũ `hooks/` (đã move vào `src/shared/hooks/`)
- [x] Xóa folder cũ `types/` (đã move vào `src/shared/types/`)
- [x] Xóa folder cũ `constants/` (đã move vào `src/shared/constants/`)
- [x] Xóa folder cũ `config/` (đã move vào `src/shared/config/`)
- [x] Xóa folder cũ `services/` (đã move vào `src/features/`)
- [x] Xóa folder cũ `features/` (đã move vào `src/features/`)
- [x] Xóa folder cũ `styles/` (đã move vào `src/styles/`)

---

## 🎉 Migration Status: COMPLETE

**Ngày hoàn thành:** December 29, 2025

### Cấu trúc dự án mới:

```
src/
├── app/                      # Next.js App Router
├── components/               # Global components (Header, Footer)
├── features/                 # Feature modules (FSD)
│   ├── auth/
│   ├── booking/
│   ├── clinics/
│   ├── health-guide/
│   ├── account/
│   └── home/
├── shared/                   # Shared resources
│   ├── ui/                  # shadcn components
│   ├── hooks/
│   ├── lib/
│   ├── types/
│   ├── constants/
│   ├── config/
│   ├── i18n/
│   └── provider/
└── store/                    # Zustand stores
```

---

**Legend:**
- ✅ Completed
- 🔄 In Progress  
- ⏳ Pending
- ❌ Blocked
