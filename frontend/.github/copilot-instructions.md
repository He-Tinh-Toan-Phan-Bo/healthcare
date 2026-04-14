```instructions
applyTo: "*_/_"

> **Note:** All code, configuration, or structure generated must STRICTLY FOLLOW the conventions, stack, and folder structure described below. Do not generate any code, library, or pattern that is not explicitly mentioned in this guide.

# Clinic Booking UI — Copilot Instructions

## Language Policy

- Use **English** for all code, identifiers, comments, commit messages, PRs, and API docs.
- Use **Vietnamese** only for end-user UI copy (labels, toasts, emails, landing pages).
- If a prompt mixes languages, always prefer English except for end-user copy.

## Stack & Context

- **Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS v3+**
- State: Zustand | Forms: React Hook Form + Zod | HTTP: Axios | i18n: react-i18next
- Testing: Jest + Testing Library | UI: shadcn/ui
- Architecture: Feature-Sliced Design (FSD)

## Structure & Naming

- Feature-first folders: `src/features/[feature]` (e.g. `booking`, `clinics`, `auth`, ...)
- Shared resources: `src/shared/` (ui, hooks, utils, config, constants, i18n, types, assets, layouts, provider)
- Global state: `src/store/` | App routes/layouts: `src/app/`
- Global components (Header, Footer): `src/components/`
- Use **Server Components** by default; add `"use client"` only for interactive parts
- Naming: files/routes `kebab-case`, components `PascalCase`, hooks/utils `camelCase`
- Centralize types in `shared/types/`

## HTTP, Data Fetching & Error Handling

- Use `@/shared/lib/baseApi.ts` for Axios instance (`baseURL = process.env.NEXT_PUBLIC_API_BASE_URL`)
- Attach `Authorization: Bearer <token>` if present (from cookies/session)
- Normalize API errors: `{ code: string; message: string; details?: any }`
- Use React Query (`@tanstack/react-query`) for all data fetching/mutations; never call Axios directly in components
- Query keys: `['bookings']`, `['clinics']`, `['profile']`, etc. | Mutations must invalidate relevant queries
- API errors: FE must use HTTP status + `code` mapping. Common codes: `USER_NOT_FOUND`, `CLINIC_UNAVAILABLE`, `UNAUTHORIZED`, `FORBIDDEN`, `VALIDATION_FAILED`, etc.

## Forms & Validation

- Use `react-hook-form` + `@hookform/resolvers/zod`
- Schemas: `features/[feature]/constants/` or `shared/schemas/`
- Reusable inputs: `FormField`, `Input`, `Select`, etc. in `shared/ui/`
- Show validation messages under fields; avoid inline `any`

## Routing & Auth

- Auth guard by role; unauthenticated users redirected to `/login`
- Admin routes: `/admin/`
- Use `src/store/authStore.ts` for auth state management

## UI/UX Guidelines

- Use Tailwind CSS utility classes; avoid inline styles
- Icons: `lucide-react`
- Toasts: use shared toast component from `@/shared/ui/toast`
- Accessibility: label all buttons, reflect loading/disabled states; all interactive elements must be keyboard accessible
- All user-facing text must be translatable via i18n

## Environment & Build

- Public env vars (prefix `NEXT_PUBLIC_`):
  - `NEXT_PUBLIC_API_BASE_URL`, `NEXT_PUBLIC_APP_NAME`, `NEXT_PUBLIC_DEFAULT_LANGUAGE`
- Scripts: dev `pnpm dev`, build `pnpm build`, start `pnpm start`, test `pnpm test`

## What to Generate (for Copilot)

- Strongly typed hooks: `useBooking`, `useClinicList`, `useProfile`, etc.
- Forms using `react-hook-form` + Zod resolvers
- All network calls wrapped by React Query (never call Axios directly in components)
- Unit tests for pure helpers and all main components (React Testing Library)
- Clear function-level comments

## Coding Rules

- Always use eslint/prettier, follow project code style; avoid `any` and unnecessary `eslint-disable`
- Organize code: separate components, hooks, services, schemas, types, and styles into their respective folders
- Only use function components, never class components; all props must be typed, never accept free-form objects
- Reuse input, form, modal, toast, and confirm dialog components where possible
- Never store token in localStorage; use cookies/session if needed
- Always show clear toast messages; avoid duplicate toasts; show loading and error states clearly
- Validate forms both client and server side; always display detailed error messages
- Use memoization (`useMemo`, `useCallback`) to optimize performance; avoid unnecessary re-renders
- Never render untrusted data directly (prevent XSS); never log tokens or sensitive info to console

## Project Structure

```
src/
├── app/                      # Next.js App Router
│   ├── layout.tsx
│   ├── page.tsx
│   ├── (auth)/              # Auth routes group
│   │   ├── login/
│   │   └── register/
│   ├── clinics/
│   ├── booking/
│   ├── health-guide/
│   ├── account/
│   └── admin/
│
├── components/               # Global components
│   ├── Header.tsx
│   ├── Footer.tsx
│   └── Logo.tsx
│
├── features/                 # Feature modules (FSD)
│   ├── auth/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── types/
│   │   └── index.ts
│   ├── clinics/
│   ├── booking/
│   ├── health-guide/
│   ├── account/
│   └── home/
│
├── shared/                   # Shared resources
│   ├── ui/                  # shadcn components
│   ├── hooks/               # Shared hooks
│   ├── lib/                 # API client, utilities
│   ├── types/               # Global types
│   ├── constants/           # Constants
│   ├── config/              # Config
│   ├── i18n/                # Internationalization
│   ├── provider/            # Context providers
│   └── utils/               # Utility functions
│
├── store/                    # Global state (Zustand)
│   ├── authStore.ts
│   └── uiStore.ts
│
└── styles/                   # Global styles
    └── globals.css
```
```
