You are an expert Next.js 14 engineer helping build a hackathon app boilerplate.
Follow every instruction exactly. Do not add unrequested features.
Ask before making any assumptions.

═══════════════════════════════════════════════════════
PROJECT OVERVIEW
═══════════════════════════════════════════════════════

App Name: (to be decided at hackathon)
Framework: Next.js 14 — App Router, TypeScript, Tailwind CSS
Goal: A mobile-first web app that looks and feels like a native app.
     It will also be wrapped in a Flutter WebView for the app submission.
     One codebase. Two submissions.

Design philosophy:
- Max width 430px centered (mobile viewport)
- Bottom tab navigation (no top navbar on mobile)
- Safe area insets for notch/home indicator
- Feels native — no horizontal scroll, no page jumps
- Fast — minimal JS, server components where possible

═══════════════════════════════════════════════════════
TECH STACK
═══════════════════════════════════════════════════════

Frontend   : Next.js 14 App Router, TypeScript, Tailwind CSS
Auth       : NextAuth v4 (JWT strategy, credentials + Google OAuth)
ORM        : Prisma
Database   : PostgreSQL via Neon (serverless, free tier)
Validation : Zod
Icons      : lucide-react
Utilities  : clsx, bcryptjs, axios
Deploy     : Vercel

NO other libraries unless explicitly asked.
NO UI component libraries (no shadcn, no MUI, no Chakra).
Build UI from scratch with Tailwind only.

═══════════════════════════════════════════════════════
STRICT RULES — FOLLOW ALWAYS
═══════════════════════════════════════════════════════

1. Every component must be lightweight — no bloat.
2. Use server components by default. Add "use client" only when needed
   (event handlers, hooks, browser APIs).
3. All API routes return consistent JSON:
     success: { data: ..., message: "..." }
     error:   { error: "...", code: "..." }
4. All forms validated with Zod — both client and server side.
5. Never hardcode secrets. Always use process.env.VARIABLE_NAME.
6. Prisma client must use the singleton pattern (no hot-reload leaks).
7. Every protected page/route must check session — never trust client.
8. Mobile first — every component designed for 390px width first.
9. Each phase must be independently testable before moving to next.
10. Never modify files from a previous phase unless explicitly asked.

═══════════════════════════════════════════════════════
FOLDER STRUCTURE — CREATE EXACTLY THIS
═══════════════════════════════════════════════════════

hackathon-app/
├── prisma/
│   └── schema.prisma
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   └── signup/
│   │   │       └── page.tsx
│   │   ├── (protected)/
│   │   │   ├── layout.tsx          ← has BottomNav
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx
│   │   │   └── profile/
│   │   │       └── page.tsx
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   └── [...nextauth]/
│   │   │   │       └── route.ts
│   │   │   └── user/
│   │   │       └── route.ts
│   │   ├── layout.tsx              ← root layout, Providers
│   │   ├── page.tsx                ← redirect to /dashboard or /login
│   │   └── globals.css
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Button.tsx
│   │   │   └── Input.tsx
│   │   ├── BottomNav.tsx
│   │   └── Providers.tsx
│   ├── lib/
│   │   ├── auth.ts                 ← NextAuth config
│   │   ├── db.ts                   ← Prisma singleton
│   │   └── validations.ts          ← Zod schemas
│   └── middleware.ts               ← route protection
├── .env.local                      ← never commit this
├── .env.example                    ← commit this (empty values)
├── .gitignore
├── next.config.js
├── tailwind.config.ts
└── tsconfig.json

═══════════════════════════════════════════════════════
PHASE 1 — PROJECT SCAFFOLD
═══════════════════════════════════════════════════════

GOAL: Bare bones project. Nothing functional yet. Just structure.

TASKS:
1. Run create-next-app with these exact flags:
   npx create-next-app@latest hackathon-app \
     --typescript --tailwind --eslint --app \
     --src-dir --import-alias "@/*"

2. Install dependencies:
   npm install next-auth @auth/prisma-adapter \
     prisma @prisma/client \
     bcryptjs zod clsx lucide-react axios
   npm install -D @types/bcryptjs

3. Create the full folder structure listed above.
   Create empty files as placeholders.
   Add a one-line comment in each: // PHASE 1 PLACEHOLDER

4. Create .env.example with these keys (empty values):
   DATABASE_URL=
   NEXTAUTH_SECRET=
   NEXTAUTH_URL=
   GOOGLE_CLIENT_ID=
   GOOGLE_CLIENT_SECRET=

5. Update .gitignore to include:
   .env.local
   .env*.local

6. Update tailwind.config.ts content path to include src/**/*.{ts,tsx}

7. Replace globals.css with:
   @tailwind base;
   @tailwind components;
   @tailwind utilities;

   @layer base {
     * { -webkit-tap-highlight-color: transparent; box-sizing: border-box; }
     body { overflow-x: hidden; font-family: system-ui, sans-serif; }
   }
   @layer utilities {
     .pb-safe { padding-bottom: max(0.5rem, env(safe-area-inset-bottom)); }
     .pt-safe { padding-top: max(0rem, env(safe-area-inset-top)); }
   }

DONE CHECK: npm run dev must start without errors.
            / should load (even if blank).

═══════════════════════════════════════════════════════
PHASE 2 — DATABASE + PRISMA
═══════════════════════════════════════════════════════

GOAL: Database connection working. Schema defined. Ready to query.

TASKS:
1. Write prisma/schema.prisma:

   generator client {
     provider = "prisma-client-js"
   }
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }

   model User {
     id            String    @id @default(cuid())
     name          String?
     email         String    @unique
     password      String?
     image         String?
     emailVerified DateTime?
     createdAt     DateTime  @default(now())
     updatedAt     DateTime  @updatedAt
     accounts      Account[]
     sessions      Session[]
   }

   model Account {
     id                String  @id @default(cuid())
     userId            String
     type              String
     provider          String
     providerAccountId String
     refresh_token     String? @db.Text
     access_token      String? @db.Text
     expires_at        Int?
     token_type        String?
     scope             String?
     id_token          String? @db.Text
     session_state     String?
     user              User    @relation(fields: [userId], references: [id], onDelete: Cascade)
     @@unique([provider, providerAccountId])
   }

   model Session {
     id           String   @id @default(cuid())
     sessionToken String   @unique
     userId       String
     expires      DateTime
     user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
   }

2. Write src/lib/db.ts — Prisma singleton:

   import { PrismaClient } from "@prisma/client";
   const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };
   export const db = globalForPrisma.prisma ?? new PrismaClient({ log: ["query"] });
   if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;

3. Write src/lib/validations.ts — Zod schemas:

   import { z } from "zod";
   export const signupSchema = z.object({
     name: z.string().min(2, "Name must be at least 2 characters"),
     email: z.string().email("Invalid email"),
     password: z.string().min(8, "Password must be at least 8 characters"),
   });
   export const loginSchema = z.object({
     email: z.string().email("Invalid email"),
     password: z.string().min(1, "Password is required"),
   });
   export type SignupInput = z.infer<typeof signupSchema>;
   export type LoginInput = z.infer<typeof loginSchema>;

4. Run: npx prisma generate
   Then: npx prisma db push

DONE CHECK: npx prisma studio must open and show User, Account, Session tables.

═══════════════════════════════════════════════════════
PHASE 3 — AUTH (NEXTAUTH)
═══════════════════════════════════════════════════════

GOAL: Login, signup, logout working. Sessions persisting. Routes protected.

TASKS:
1. Write src/lib/auth.ts:
   - JWT strategy
   - CredentialsProvider with bcrypt password check
   - GoogleProvider (use env vars)
   - Callbacks: jwt adds user.id to token, session exposes token.id
   - Pages: signIn → "/login", error → "/login"

2. Write src/app/api/auth/[...nextauth]/route.ts:
   - Import authOptions from lib/auth
   - Export GET and POST handlers

3. Write src/app/api/user/route.ts (POST = signup):
   - Validate body with signupSchema from validations.ts
   - Check if email already exists → return 409 if so
   - Hash password with bcrypt (rounds: 12)
   - Create user in DB
   - Return 201 with { data: { id, email }, message: "Account created" }

4. Write src/middleware.ts:
   - Protect all routes under /dashboard and /profile
   - Redirect unauthenticated users to /login
   export { default } from "next-auth/middleware";
   export const config = { matcher: ["/dashboard/:path*", "/profile/:path*"] };

5. Write src/components/Providers.tsx:
   "use client"
   - Wrap children in <SessionProvider>

6. Update src/app/layout.tsx:
   - Import Inter from next/font/google
   - Wrap body in <Providers>
   - Set viewport meta: width=device-width, initial-scale=1, maximum-scale=1
   - Body class: "bg-gray-50 text-gray-900"
   - Main: "max-w-[430px] mx-auto min-h-screen relative bg-white"

DONE CHECK: POST /api/user with { name, email, password } must create a user.
            POST /api/auth/signin with credentials must return a session token.
            GET /dashboard without session must redirect to /login.

═══════════════════════════════════════════════════════
PHASE 4 — UI COMPONENTS
═══════════════════════════════════════════════════════

GOAL: Reusable primitives. Mobile-native feel. Zero dependencies.

TASKS:
1. Write src/components/ui/Button.tsx:
   - Props: children, variant ("primary"|"secondary"|"ghost"|"danger"),
            size ("sm"|"md"|"lg"), loading (boolean), fullWidth (boolean)
            + all standard button HTML attributes
   - primary: bg-violet-600 text-white hover:bg-violet-700 active:scale-95
   - secondary: bg-gray-100 text-gray-900 hover:bg-gray-200
   - ghost: bg-transparent text-violet-600 hover:bg-violet-50
   - danger: bg-red-500 text-white hover:bg-red-600
   - loading state: show spinner SVG, disable button, reduce opacity
   - fullWidth: w-full
   - Default size md: h-11 px-4 rounded-xl text-sm font-medium
   - Transitions: transition-all duration-150
   - "use client" directive

2. Write src/components/ui/Input.tsx:
   - Props: label (string), error (string), icon (ReactNode) + all input HTML attrs
   - Wrapper div with label above, input, error message below
   - Input: w-full h-11 px-4 rounded-xl border border-gray-200
             focus:outline-none focus:ring-2 focus:ring-violet-500
             bg-white text-sm placeholder:text-gray-400
   - Error state: border-red-400 focus:ring-red-400
   - Error text: text-xs text-red-500 mt-1
   - Label: text-sm font-medium text-gray-700 mb-1
   - "use client" directive

3. Write src/components/BottomNav.tsx:
   - "use client" directive
   - Tabs: Home(/dashboard), Search(/search), Notifications(/notifications), Profile(/profile)
   - Icons from lucide-react: Home, Search, Bell, User
   - Fixed bottom, max-w-[430px] mx-auto, bg-white, border-t border-gray-100
   - pb-safe for home indicator
   - Active tab: text-violet-600, icon strokeWidth 2.2
   - Inactive tab: text-gray-400, icon strokeWidth 1.5
   - Smooth color transition on tab change
   - Each tab: flex-1, flex-col, items-center, py-2, gap-0.5
   - Label: text-[10px] font-medium

DONE CHECK: Import Button and Input into a test page. All variants must render.

═══════════════════════════════════════════════════════
PHASE 5 — AUTH PAGES (LOGIN + SIGNUP)
═══════════════════════════════════════════════════════

GOAL: Beautiful, native-feeling login and signup screens.

TASKS:
1. Write src/app/(auth)/login/page.tsx:
   - "use client"
   - Form fields: email, password
   - Validate with loginSchema on submit (client side)
   - Call signIn("credentials", { email, password, redirect: false })
   - On success: router.push("/dashboard")
   - On error: show inline error message ("Invalid email or password")
   - Show loading state on button while signing in
   - Below form: "Don't have an account?" → Link to /signup
   - Google sign in button: signIn("google") — secondary variant
   - Layout: full height, flex-col, justify-center, px-6, gap-6
   - Top: App logo/name (large, centered, violet)
   - Subtitle: "Welcome back" in gray

2. Write src/app/(auth)/signup/page.tsx:
   - "use client"
   - Form fields: name, email, password
   - Validate with signupSchema on submit (client side)
   - First: POST /api/user to create account
   - Then: signIn("credentials", { email, password, redirect: false })
   - On success: router.push("/dashboard")
   - On error: show inline error below the form
   - Show loading state
   - Below form: "Already have an account?" → Link to /login
   - Same layout style as login page

3. Write src/app/page.tsx (root redirect):
   - Server component
   - getServerSession → if session → redirect("/dashboard")
   - if no session → redirect("/login")

DONE CHECK: Full signup → login → dashboard flow must work end to end.
            Refresh on /dashboard must keep user logged in.
            Logout (to be added in Phase 6) must redirect to /login.

═══════════════════════════════════════════════════════
PHASE 6 — PROTECTED LAYOUT + DASHBOARD + PROFILE
═══════════════════════════════════════════════════════

GOAL: The main app shell. What users see after logging in.

TASKS:
1. Write src/app/(protected)/layout.tsx:
   - Server component
   - getServerSession → if no session → redirect("/login")
   - Render: <div className="pb-20">{children}</div>
   - Render: <BottomNav /> below children
   - pb-20 gives space so content isn't behind the nav

2. Write src/app/(protected)/dashboard/page.tsx:
   - Server component
   - getServerSession to get user name
   - Layout: px-4 pt-6
   - Top: "Good morning, {name}" heading + date
   - A simple card grid placeholder (2 cols, 2 rows) with gray bg
   - Each card: rounded-2xl bg-gray-100 h-32 (placeholders for feature)
   - Bottom: Leave space for BottomNav (pb-20 from layout handles it)

3. Write src/app/(protected)/profile/page.tsx:
   - Server component
   - getServerSession to get user details
   - Show: avatar circle (initials), name, email
   - Settings list rows: Account, Notifications, Privacy, Help
   - Each row: flex, justify-between, py-3, border-b border-gray-100
   - Logout button at bottom:
     "use client" LogoutButton component
     calls signOut({ callbackUrl: "/login" })
     uses Button variant="danger" fullWidth

DONE CHECK: /dashboard loads and shows user name.
            /profile shows user info and logout works.
            BottomNav switches between tabs correctly.
            Refreshing any protected page keeps the session.

═══════════════════════════════════════════════════════
PHASE 7 — VERCEL DEPLOY
═══════════════════════════════════════════════════════

GOAL: Live URL on Vercel. Ready for the hackathon feature build.

TASKS:
1. Create next.config.js:
   /** @type {import('next').NextConfig} */
   const nextConfig = {
     images: { domains: ["lh3.googleusercontent.com"] },
   };
   module.exports = nextConfig;

2. Push to GitHub (new repo).

3. Connect repo to Vercel.

4. Add all env vars in Vercel dashboard:
   DATABASE_URL         ← Neon connection string
   NEXTAUTH_SECRET      ← same as local
   NEXTAUTH_URL         ← https://your-app.vercel.app
   GOOGLE_CLIENT_ID     ← if using Google
   GOOGLE_CLIENT_SECRET ← if using Google

5. Trigger deploy.

6. Update Google OAuth redirect URI in Google Console:
   https://your-app.vercel.app/api/auth/callback/google

7. Run npx prisma db push once more to confirm Neon schema is synced.

DONE CHECK: Live URL loads.
            Signup and login work on production.
            /dashboard is protected on production.

═══════════════════════════════════════════════════════
ROLLBACK GUIDE — IF ANYTHING BREAKS
═══════════════════════════════════════════════════════

Phase 1 broke → delete node_modules, npm install, npm run dev
Phase 2 broke → npx prisma db push --force-reset (warning: clears data)
Phase 3 broke → check NEXTAUTH_SECRET is set, check authOptions export
Phase 4 broke → revert the component file only, others unaffected
Phase 5 broke → check signIn import is from "next-auth/react"
Phase 6 broke → check getServerSession import, check session callback in auth.ts
Phase 7 broke → check env vars in Vercel, check NEXTAUTH_URL matches domain

═══════════════════════════════════════════════════════
AFTER ALL PHASES COMPLETE
═══════════════════════════════════════════════════════

The boilerplate is ready. At the hackathon when the problem is revealed:

STEP 1 → Add new model to prisma/schema.prisma
STEP 2 → npx prisma db push
STEP 3 → Create /app/(protected)/(feature)/page.tsx
STEP 4 → Create /app/api/(feature)/route.ts
STEP 5 → Add tab to BottomNav if needed
STEP 6 → Push to GitHub → Vercel auto-deploys

Nothing from the boilerplate needs to change. Just add on top.

═══════════════════════════════════════════════════════
IMPORTANT NOTES FOR CODEX
═══════════════════════════════════════════════════════

- Complete one phase fully before starting the next.
- After each phase, confirm the DONE CHECK passes.
- If a file already exists from a previous phase, do not overwrite it.
- If you are unsure about a requirement, stop and ask.
- Keep every file under 150 lines where possible.
- Prefer async/await over .then() chains.
- All Tailwind classes must be complete strings (no dynamic concatenation
  that Tailwind cannot statically analyze).
- Never use <any> in TypeScript. Use proper types or unknown.