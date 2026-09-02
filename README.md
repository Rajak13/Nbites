# nBites — Hyper-Local Food Delivery & Culinary Logistics Engine

> **Editorial, High-Performance Food Ordering & Real-Time Logistics Ecosystem for Nepal.**

---

## 🍽️ Overview

**nBites** is an editorial, high-performance food delivery and logistics platform engineered specifically for the Nepal market (Kathmandu Valley & nationwide). Built with an editorial brutalist design aesthetic and a high-throughput micro-monorepo architecture, nBites bridges gourmet culinary discovery, real-time kitchen display systems (KDS), automated spatial rider dispatching, and instant Nepal digital wallet payouts (eSewa & Khalti).

---

## 🏛️ Monorepo Architecture

```text
nBites/
├── apps/
│   ├── web/                    # Next.js 15 App Router (Storefront, Portals, KDS, Tracking)
│   │   ├── app/                # Server & Client Components
│   │   ├── components/         # Design System, Hero Carousel, Interactive UI
│   │   └── lib/                # Fonts, telemetry clients, utility helpers
│   └── api-server/             # Express.js + Socket.io Backend Microservice
│       ├── src/controllers/    # Auth, Order, Restaurant, Payment Controllers
│       ├── src/services/       # Spatial Dispatch (Turf.js), eSewa v2, Khalti v2
│       └── src/sockets/        # Real-time WebSockets (KDS tickets & Driver GPS)
└── packages/
    ├── database/               # Prisma ORM Singleton & Schema Migrations
    │   └── prisma/schema.prisma# Relational data models (Users, Orders, Drivers, Payments)
    └── ts-config/              # Shared Monorepo TypeScript configurations
```

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend Storefront** | Next.js 15 (App Router), React 19, Tailwind CSS v4, Lucide Icons |
| **Backend API** | Node.js, Express.js, TypeScript |
| **Real-Time Telemetry** | Socket.io (Kitchen KDS stream & Live Driver GPS telemetry) |
| **Spatial Routing** | `@turf/turf` (Haversine distance, driver allocation, valley radius geofencing) |
| **Database & ORM** | PostgreSQL, Prisma ORM singleton client |
| **Payment Gateways** | eSewa v2 (`HMAC-SHA256` signature verification), Khalti v2 ePayment API |
| **Design System** | Editorial Brutalist (`#f5e3cd` Warm Cream, `#f91814` Vibrant Red, `#18120e` Espresso Black) |
| **Typography** | `'Clubstone'` (Display headlines) & `'Nokie'` (Body / Controls) |

---

## 🌿 Collaborative Branching Strategy

To enable multiple developers to work concurrently across frontend, backend, and database domains without collision or broken builds, this repository adheres to a strict hierarchical branching model:

```text
                [ main ]  (Production-Ready Releases)
                   │
              [ develop ]  (Integration & Testing)
            ┌──────┼──────┐
            ▼      ▼      ▼
    [ frontend/core ] [ backend/core ] [ database/core ]
            │             │                 │
    feat/web-hero   feat/dispatch-turf   feat/order-schema
```

### Branch Roles & Hierarchy

1. **`main`**: Production branch. Only merges from `develop` via approved pull requests with passing CI.
2. **`develop`**: Central integration branch. All domain cores merge here for pre-release verification.
3. **`frontend/core`**: Active development for `apps/web` (Storefront, UI design system, KDS views, customer journeys).
4. **`backend/core`**: Active development for `apps/api-server` (REST endpoints, WebSockets, payment services, Turf spatial logistics).
5. **`database/core`**: Schema definitions, Prisma migrations, and database seeders in `packages/database`.

### Developer Workflow & Branch Naming Conventions

When developing a new feature or fix:

```bash
# 1. Branch from the respective domain core:
git checkout frontend/core
git checkout -b feat/frontend/<feature-name>

# or for backend:
git checkout backend/core
git checkout -b feat/backend/<service-name>

# or for database:
git checkout database/core
git checkout -b feat/database/<migration-name>
```

- **Feature PRs**: Target the respective domain core branch (`feat/frontend/*` -> `frontend/core`).
- **Domain PRs**: Target `develop` once a milestone is verified (`frontend/core` -> `develop`).
- **Release PRs**: Target `main` (`develop` -> `main`).

---

## 🚀 Getting Started

### Prerequisites
- Node.js `>= 18.18.0`
- npm `>= 9.0.0` (or pnpm)
- PostgreSQL database instance

### 1. Installation

Clone the repository and install dependencies across all workspaces:

```bash
git clone https://github.com/Rajak13/Nbites.git
cd Nbites
npm install
```

### 2. Environment Configuration

Copy the example environment configuration:

```bash
cp .env.example .env
```

Fill in your database URL and payment credentials:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/nbites_db?schema=public"
PORT=4000
JWT_SECRET="your-super-secret-jwt-key"
ESEWA_PRODUCT_CODE="EPAYTEST"
ESEWA_SECRET_KEY="8gBm/:&EnhH.1/q("
KHALTI_SECRET_KEY="test_secret_key_..."
NEXT_PUBLIC_API_URL="http://localhost:4000"
```

### 3. Database Migration & Prisma Generation

```bash
# Generate Prisma Client singleton
npm run db:generate

# Run migrations on your local database
npm run db:migrate
```

### 4. Running the Development Environment

Run both Next.js Web App and Express Backend API concurrently:

```bash
npm run dev
```

Or run individual workspaces:

```bash
# Run only Next.js Storefront (http://localhost:3000)
npm run dev:web

# Run only Express Backend Server (http://localhost:4000)
npm run dev:api
```

---

## ⚡ Key Features

- **Editorial 3-Act Hero Storytelling**: High-impact auto-advancing carousel showcasing artisan burgers, thermal takeaway packaging, and wood-fired pizzas with interactive red underline micro-interactions.
- **Continuous Sliding Checkerboard Ribbon**: Authentic red-and-white diner checkerboard motif running infinitely along the viewport base.
- **Live Kitchen Display System (KDS)**: Real-time ticket management state machine (`PENDING` -> `PREPARING` -> `READY_FOR_PICKUP`).
- **Spatial Rider Dispatch (Turf.js)**: Haversine distance calculations and automated rider radial routing for the Kathmandu Valley ecosystem.
- **Nepal Payment Gateway Integration**: Native support for **eSewa v2** HMAC signatures and **Khalti v2** ePayment verification.

---

## 📜 License

MIT © [nBites Team](https://github.com/Rajak13/Nbites)
