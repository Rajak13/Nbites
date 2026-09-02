# nBites Monorepo — AI Agent Directives & Context

Welcome to the nBites Monorepo codebase. This document outlines architectural standards, design principles, conventions, and operational guidelines for all AI agents and developers working across this codebase.

---

## 1. System Architecture Overview

nBites is an editorial, high-performance food delivery & logistics ecosystem focused on the Kathmandu Valley market.

```
nbites-monorepo/
├── apps/
│   ├── web/          # Next.js 16 App Router (Storefront, Portals, KDS, Telemetry)
│   └── api-server/   # Express.js + Socket.io (Real-time telemetry, Turf logistics, Payments)
└── packages/
    ├── database/     # Prisma ORM & Database singletons
    └── ts-config/    # Monorepo TypeScript configurations
```

---

## 2. Frontend Guidelines (`apps/web` — Next.js 16)

### 2.1 React Server Components (RSC) & Partial Prerendering (PPR)
- Default to **Server Components** for all layout structures, static editorial sections, and initial data fetching.
- Mark interactive leaves with `'use client'` only when state (`useState`, `useReducer`), browser APIs, or real-time WebSockets/listeners are needed.
- Use `next/image` with remote patterns configured for CDN assets.
- Utilize Partial Prerendering (`experimental.ppr = true`) to stream dynamic segments (e.g., live telemetry counters, user-specific cart) into statically cached shell layouts.

### 2.2 Editorial Brutalist Design System
- **Color Palette**:
  - Background Dark: `#0B0B0B`, Surface: `#141414`, Border: `#262626`
  - Accent / Primary: `#F97316` (Warm Saffron / Burnt Orange), Amber `#F59E0B`
  - Text Primary: `#F5F5F0` (Off-white / Warm Canvas), Text Muted: `#A3A3A3`
- **Typography**:
  - Editorial Headlines: `var(--font-clubstone)` (`ClubstoneRegular.ttf`)
  - Body & UI Controls: `var(--font-nokie)` (`Nokie.otf`)
- **Brutalist Tokens**:
  - **Buttons**: `rounded-none` (0px border radius), thick borders (`border-2`), solid high-contrast hover states (`translate-x-0.5 translate-y-0.5 shadow-[4px_4px_0px_0px_rgba(249,115,22,1)]`).
  - **Status Chips / Badges**: `rounded-full` (100px pill radius) with uppercase mono font and pulsating telemetry indicators.
  - **Cards & Panes**: Sharp edges (`rounded-none`), heavy dark border framing (`border-zinc-800`), industrial typography.

---

## 3. Backend Guidelines (`apps/api-server`)

### 3.1 Services & Domain Separation
- **`esewa.service.ts`**: eSewa v2 signature generator using `HMAC-SHA256` formatting `total_amount,transaction_uuid,product_code` to base64.
- **`khalti.service.ts`**: Khalti ePayment initiation and lookup verification via Khalti v2 API endpoints.
- **`dispatch.service.ts`**: Spatial routing using `@turf/turf` to calculate nearest driver, Haversine distances, route bearing, and Kathmandu Valley delivery radius.
- **`sockets/`**: Real-time event streams:
  - `kds.socket.ts`: Live kitchen ticket stream and status state machine (`PENDING` -> `PREPARING` -> `READY_FOR_PICKUP`).
  - `driver.socket.ts`: Live rider GPS coordinate streaming and ETA updates.

---

## 4. Shared Database Layer (`packages/database`)

- All database access MUST use the exported Prisma singleton from `@nbites/database`.
- Never instantiate multiple `PrismaClient` instances in server actions or API controllers to prevent connection exhaustion.
- Always handle relational constraints and transaction rollbacks gracefully.

---

## 5. Development & Execution Commands

### Using NPM (Native Node)
```bash
# Install dependencies across all workspaces
npm install

# Run both Frontend and Backend concurrently
npm run dev

# Run only Next.js Web App
npm run dev:web

# Run only Express Backend API
npm run dev:api

# Database migrations & Client Generation
npm run db:generate
npm run db:migrate
```

### Using PNPM (Optional)
```bash
# If pnpm is installed globally (npm i -g pnpm or corepack enable)
pnpm install
pnpm dev
```
