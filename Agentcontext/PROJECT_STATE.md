# VMS — Intelligent Visitor Management System
## Single Source of Truth — Project State

> **Last Updated:** 2026-04-19T12:51 IST

---

## 🎯 What We Are Building
A hackathon-ready Intelligent Visitor Management System for a smart campus.
- **Only the VISITOR persona** gets a frontend UI
- Guard, Admin, Host interfaces → backend-only API endpoints + Swagger docs
- Judged on **7 criteria**: Data modeling, ER diagram, Architecture diagram, CI/CD, REST API + Swagger, Frontend persona, Dockerizable

---

## 📂 Project Structure (Final)
```
web-app/
├── prisma/
│   ├── schema.prisma         ← 9 models (6 VMS + 3 auth)
│   ├── seed.ts               ← Sample data (5 hosts, 3 gates, 3 visitors)
│   └── migrations/           ← init_vms_tables migration ✅
├── src/
│   ├── app/
│   │   ├── (auth)/            ← Login, Signup pages (existing)
│   │   ├── (protected)/       ← Dashboard, Admin, etc. (existing)
│   │   ├── api/
│   │   │   ├── visitors/
│   │   │   │   ├── register/route.ts     ← POST register ✅
│   │   │   │   └── [id]/
│   │   │   │       ├── pass/route.ts     ← GET pass ✅
│   │   │   │       ├── history/route.ts  ← GET history ✅
│   │   │   │       └── regenerate-otp/route.ts ← POST regen ✅
│   │   │   ├── visits/
│   │   │   │   ├── checkin/route.ts      ← POST checkin ✅
│   │   │   │   ├── checkout/route.ts     ← POST checkout ✅
│   │   │   │   └── active/route.ts       ← GET active ✅
│   │   │   ├── blacklist/route.ts        ← POST blacklist ✅
│   │   │   ├── health/route.ts           ← GET health ✅
│   │   │   ├── hosts/route.ts            ← GET hosts ✅
│   │   │   ├── cron/overstay/route.ts    ← GET overstay ✅
│   │   │   └── docs/
│   │   │       ├── page.tsx              ← Swagger UI ✅
│   │   │       └── spec/route.ts         ← OpenAPI spec ✅
│   │   ├── register/page.tsx             ← Registration page ✅
│   │   ├── pass/[visitId]/page.tsx       ← QR Pass page ✅
│   │   ├── visit/[visitId]/page.tsx      ← Live status page ✅
│   │   ├── page.tsx                      ← Landing page ✅
│   │   ├── layout.tsx                    ← Root layout ✅
│   │   └── globals.css                   ← Global styles + animations ✅
│   ├── components/
│   │   ├── vms/
│   │   │   ├── RegistrationForm.tsx      ← Multi-step form ✅
│   │   │   ├── PassDisplay.tsx           ← QR + OTP display ✅
│   │   │   └── VisitStatus.tsx           ← Live visit status ✅
│   │   └── (existing components...)
│   └── lib/
│       ├── db.ts                ← Prisma singleton ✅
│       ├── redis.ts             ← Upstash Redis client ✅
│       ├── auth.ts              ← NextAuth config ✅
│       ├── validations.ts       ← Auth Zod schemas ✅
│       ├── vms-validations.ts   ← VMS Zod schemas ✅
│       ├── roles.ts             ← Role hierarchy ✅
│       ├── qr.ts                ← QR code generation ✅
│       ├── otp.ts               ← OTP generation ✅
│       ├── email.ts             ← Gmail SMTP utility ✅
│       └── swagger.ts           ← OpenAPI 3.0 spec ✅
├── docker-compose.yml           ✅
├── Dockerfile                   ✅
├── .github/workflows/
│   ├── ci.yml                   ✅
│   └── deploy.yml               ✅
└── Agentcontext/                ← This folder
```

---

## 🔧 Tech Stack
| Layer        | Technology                  | Why                                       |
|-------------|-----------------------------|--------------------------------------------|
| Framework   | Next.js 16 (App Router)     | SSR + API routes in one repo               |
| Language    | TypeScript                  | Type safety                                |
| ORM         | Prisma 6.x                  | Type-safe queries, ER diagram, migrations  |
| Database    | PostgreSQL (Neon.tech)      | Free hosted, ACID transactions             |
| Cache       | **Upstash Redis** (REST)    | OTP TTL, active visitor set, blacklist cache|
| Auth        | NextAuth v4 + JWT           | Google OAuth + Credentials                 |
| Styling     | Tailwind CSS v4             | Rapid UI development                       |
| QR          | qrcode + qrcode.react       | QR generation                              |
| Validation  | Zod v4                      | Schema validation                          |
| API Docs    | Swagger UI React            | Swagger at /api/docs                       |
| Email/OTP   | Gmail SMTP (Nodemailer)     | Send OTP via Gmail app password            |

---

## 🗄️ Data Model (6 VMS Tables + 3 Auth Tables)

### Enums
- `VisitStatus`: PENDING | APPROVED | CHECKED_IN | CHECKED_OUT | OVERSTAYED | DENIED
- `Role`: SUPERADMIN | ADMIN | USER

### VMS Tables
1. **Visitor** — id (uuid), fullName, email (unique), phone, photoUrl?, isBlacklisted, createdAt
2. **Host** — id (uuid), name, department, email (unique), phone, createdAt
3. **Gate** — id (uuid), name, location, isActive
4. **Visit** — id (uuid), visitorId→Visitor, hostId→Host, gateId→Gate?, purpose, status, qrToken (unique), otp, scheduledAt, checkedInAt?, checkedOutAt?, expectedOut?, createdAt
5. **AuditLog** — id (uuid), visitId→Visit, action, actorId, metadata (JSON), createdAt
6. **Blacklist** — id (uuid), visitorId→Visitor (unique), reason, addedBy, addedAt, expiresAt?

### Auth Tables (NextAuth)
7. **User** — id, name, email, password, role, etc.
8. **Account** — OAuth account linking
9. **Session** — JWT sessions

### Indexes
- Visit: visitorId, status, checkedInAt, qrToken
- AuditLog: visitId

---

## 🌐 Environment Variables (.env)
```env
DATABASE_URL="postgresql://..."          # Neon.tech PostgreSQL ✅
NEXTAUTH_SECRET="..."                    # JWT secret ✅
NEXTAUTH_URL="http://localhost:3000"     # ✅
GOOGLE_CLIENT_ID="..."                   # Google OAuth ✅
GOOGLE_CLIENT_SECRET="..."              # Google OAuth ✅
UPSTASH_REDIS_REST_URL="..."            # Upstash Redis ✅
UPSTASH_REDIS_REST_TOKEN="..."          # Upstash Redis ✅
GMAIL_USER="..."                         # For OTP emails (optional)
GMAIL_APP_PASSWORD="..."                # Gmail app password (optional)
```

---

## 📡 API Endpoints (10 total)
| # | Method | Route                              | Purpose                              | Status |
|---|--------|------------------------------------|--------------------------------------|--------|
| 1 | POST   | `/api/visitors/register`           | Register visitor, gen QR+OTP         | ✅     |
| 2 | POST   | `/api/visits/checkin`              | Check-in via QR token or OTP         | ✅     |
| 3 | POST   | `/api/visits/checkout`             | Check-out, calc duration             | ✅     |
| 4 | GET    | `/api/visits/active`               | List active visitors from Redis      | ✅     |
| 5 | GET    | `/api/visitors/[id]/pass`          | Get QR data + OTP for latest visit   | ✅     |
| 6 | GET    | `/api/visitors/[id]/history`       | Paginated visit history              | ✅     |
| 7 | POST   | `/api/visitors/[id]/regenerate-otp`| Regenerate expired OTP               | ✅     |
| 8 | POST   | `/api/blacklist`                   | Blacklist a visitor                  | ✅     |
| 9 | GET    | `/api/health`                      | System health check                  | ✅     |
| 10| GET    | `/api/hosts`                       | List hosts for dropdown              | ✅     |

### Swagger Documentation
- **Swagger UI:** `/api/docs`
- **OpenAPI JSON:** `/api/docs/spec`

---

## 🖥️ Frontend Pages
### Visitor Pages
| # | Route              | Description                           | Status |
|---|--------------------|---------------------------------------|--------|
| 1 | `/`                | Landing — "Smart Campus Visitor Pass" | ✅     |
| 2 | `/register`        | Multi-step registration form (3 steps)| ✅     |
| 3 | `/pass/[visitId]`  | QR code + OTP + countdown timer       | ✅     |
| 4 | `/visit/[visitId]` | Live visit status (3 states)          | ✅     |

### Guard Portal Pages (Protected — ADMIN role)
| # | Route                       | Description                           | Status |
|---|------------------------------|---------------------------------------|--------|
| 5 | `/guard/login`              | Guard login (credentials auth)        | ✅     |
| 6 | `/guard/dashboard`          | Active visitors + stats + quick actions| ✅     |
| 7 | `/guard/scan`               | Camera QR scanner (html5-qrcode)      | ✅     |
| 8 | `/guard/manual`             | Manual OTP/token entry + check-in/out | ✅     |
| 9 | `/guard/checkout/[visitId]` | Visitor checkout confirmation          | ✅     |

### Guard Credentials (Seeded)
- **guard1@campus.edu** / guard@123 (Main Gate Guard)
- **guard2@campus.edu** / guard@123 (East Gate Guard)

### Visit Status States
- **CHECKED_IN:** Green checkmark, live timer, welcome message
- **OVERSTAYED:** Amber warning banner, contact host button
- **CHECKED_OUT:** Confetti animation, duration badge, download receipt

### 📱 PWA (Progressive Web App) ✅
- `manifest.json` with app shortcuts (Register Visit, Guard Scanner)
- Service worker (`sw.js`) with cache-first strategy
- PWA icons (192px, 512px)
- Installable on mobile — standalone mode, dark theme

---

## 🏗️ Build Phases — All Complete

### Phase 1: Scaffold & Data Modeling ✅
- [x] Prisma schema with 6 VMS tables + 3 auth tables
- [x] Migration applied (`init_vms_tables`)
- [x] Seed file (5 hosts, 3 gates, 3 visitors, 1 blacklisted)
- [x] All dependencies installed

### Phase 2: Infrastructure & Utilities ✅
- [x] Upstash Redis client (`src/lib/redis.ts`)
- [x] QR code generation utility (`src/lib/qr.ts`)
- [x] OTP generation utility (`src/lib/otp.ts`)
- [x] Gmail SMTP email utility (`src/lib/email.ts`)
- [x] VMS-specific Zod schemas (`src/lib/vms-validations.ts`)
- [x] OpenAPI/Swagger spec (`src/lib/swagger.ts`)

### Phase 3: Backend REST API + Swagger ✅
- [x] All 10 API endpoints working
- [x] Swagger UI live at `/api/docs`
- [x] Overstay cron endpoint at `/api/cron/overstay`
- [x] Full Zod validation on all inputs
- [x] Audit logging on all mutations

### Phase 4: Frontend Visitor Persona ✅
- [x] Premium landing page with gradient hero
- [x] Multi-step registration form (3 steps)
- [x] QR pass page with OTP countdown + regeneration
- [x] Live visit status with 3 state views
- [x] Offline mode (localStorage caching)
- [x] WhatsApp sharing, receipt download

### Phase 5: CI/CD Pipeline ✅
- [x] `.github/workflows/ci.yml` (lint → test → build)
- [x] `.github/workflows/deploy.yml` (build → push → deploy)
- [x] Dockerfile (multi-stage build)
- [x] docker-compose.yml (3 services)

### Phase 6: Polish & Demo 🔲
- [ ] Complete README.md
- [ ] DEMO.md walkthrough script
- [ ] Architecture diagram
- [ ] ER diagram
- [ ] Jest test files

---

## 🔑 Key Decisions & Architecture
1. **Upstash Redis (REST)** — No Docker Redis needed for dev; sub-ms lookups for blacklist, active visitors, OTP
2. **Gmail SMTP** — Gracefully degrades if credentials not set (logs OTP to console)
3. **Visitor-only frontend** — All other personas are API-only + Swagger docs
4. **Neon PostgreSQL** — Free hosted with connection pooling
5. **Existing auth system preserved** — NextAuth with RBAC stays for admin endpoints
6. **Polling for real-time** — 5-10 second intervals (Socket.io can be added later)
7. **localStorage offline mode** — QR pass cached for offline gate display

---

## 📊 Redis Key Structure
```
otp:<visitId>          → "123456"     (TTL: 300s)
active-visitors        → Set{visitorId1, visitorId2, ...}
blacklist              → Set{visitorId1, visitorId2, ...}
ratelimit:<ip>         → count        (TTL: 60s)
```

---

## 🔐 Edge Cases Handled
- Duplicate check-in → 409 with original timestamp
- Duplicate registration (same email, same day) → 409 with existing visitId
- Blacklisted visitor → 403 at registration AND check-in
- OTP expiry → Regeneration endpoint + countdown UI
- Offline mode → localStorage caching for form and pass
- Overstay detection → Cron endpoint updates status
- Schedule window → ±2 hours check at gate
- Rate limiting → Redis counter with 60s window (10 req/min)
