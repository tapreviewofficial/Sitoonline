# TapTrust - Full-Stack Review Collection Platform

## Overview

TapTrust is a full-stack web application designed to help businesses collect customer reviews through NFC technology. The platform enables users to create personalized public profiles where customers can easily leave reviews by tapping an NFC card. The application combines a luxury black and gold theme (#0a0a0a / #CC9900) with modern React components to deliver a premium user experience.

**Deployment Status:** Fully optimized for Vercel Free Tier with **8 consolidated serverless functions** (under 12 function limit) covering all 31 API routes. Architecture uses pathname-based routing within consolidated handlers to maximize functionality while minimizing function count.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The client-side application is built with React, TypeScript, and Vite, providing a modern development experience with hot module replacement. The UI is constructed using shadcn/ui components built on top of Radix UI primitives, ensuring accessibility and consistency. TailwindCSS provides utility-first styling with custom CSS variables for the luxury theme. State management is handled by TanStack React Query for server state synchronization, while Wouter provides lightweight client-side routing.

### Backend Architecture  
The application uses **Vercel serverless functions** optimized for Free Tier constraints. Architecture consolidates 31 API routes into 8 serverless functions:

**Consolidated API Functions** (`/api`):
- `auth.ts` (7 routes): login, logout, register, password reset flows, change password
- `user.ts` (4 routes): me, profile, links CRUD operations
- `analytics.ts` (3 routes): summary stats, clicks analytics, links performance
- `admin.ts` (4 routes): user management, stats, impersonation system
- `promos.ts` (5 routes): promotions CRUD, activation, ticket generation
- `tickets.ts` (2 routes): ticket status checking, redemption
- `public.ts` (3 routes): public profiles, active promotions, claiming
- `other.ts` (3 routes): link redirects, promotional contacts, public pages

**Technical Implementation**:
- **Pathname-based Routing**: Each consolidated file uses URL path matching to handle multiple endpoints
- **Vercel Rewrites**: `vercel.json` maps incoming paths to consolidated handlers (e.g., `/api/auth/login` → `/api/auth.ts`)
- **Shared Utilities** (`/lib/shared`): Database pooling, JWT auth, storage layer, email service
- **Stateless Design**: All functions stateless with connection pooling and JWT authentication
- **Error Handling**: Consistent HTTP status codes and JSON responses

### Authentication & Authorization
Authentication uses JWT tokens stored in HTTP-only cookies with a 30-day expiration. Passwords are hashed using bcryptjs with a salt rounds of 12. The system includes middleware for protected routes (requireAuth) and optional authentication checking (getCurrentUser). Cookie security is **production-hardened** with:
- **SameSite=Strict** for CSRF protection (prevents cookie transmission in cross-site requests)
- **Secure flag** in production (HTTPS-only cookie transmission)
- **HttpOnly flag** (prevents JavaScript access, mitigates XSS)
- **JWT_SECRET validation** at startup (throws error if missing, no hardcoded fallback)

### Security Hardening (October 2025)
TapReview implements **comprehensive security measures** to protect user data and prevent common web vulnerabilities:

**1. CSRF Protection:**
- All authentication cookies use `SameSite=Strict` to prevent cross-site request forgery
- Admin impersonation cookies also use `SameSite=Strict` with audit logging

**2. Security Headers** (via `vercel.json`):
- `Content-Security-Policy`: Strict policy allowing only trusted sources (self, Supabase, Replit fonts)
- `Strict-Transport-Security`: HSTS with 1-year max-age and includeSubDomains
- `X-Frame-Options: DENY`: Prevents clickjacking attacks
- `X-Content-Type-Options: nosniff`: Prevents MIME sniffing
- `Referrer-Policy: strict-origin-when-cross-origin`: Limits referrer information leakage
- `Permissions-Policy`: Blocks camera, microphone, geolocation access

**3. Rate Limiting** (`lib/shared/rateLimit.ts`):
- **Login endpoint**: 5 attempts per 15 minutes (prevents brute force)
- **Password reset**: 3 attempts per hour (prevents email flooding)
- **Ticket redemption**: 10 attempts per minute (prevents abuse)
- In-memory per-function instance tracking with automatic cleanup

**4. Input Validation & Sanitization** (`lib/shared/validation.ts`):
- XSS pattern detection and removal (script tags, event handlers, javascript: URLs)
- SQL injection pattern detection (defense in depth, Drizzle ORM already prevents)
- Email, username, URL, and HTML sanitization functions
- Applied to all user inputs at API boundaries

**5. Ticket Redemption Idempotency** (`api/tickets.ts`):
- **Atomic conditional updates**: `UPDATE WHERE status='ACTIVE'` prevents race conditions
- Transaction-based redemption ensures only one successful redemption per ticket
- Audit logging in `scanLogs` with IP address and user agent tracking
- Proper error handling for "already used" vs "not found" states

**6. Admin Audit Logging** (`api/admin.ts`):
- Console warn logs for all admin impersonation attempts (start and stop)
- Logged data: timestamp, action type, admin ID/email, target user ID/email, IP address, user agent
- Structured JSON format for easy parsing by external logging services (Datadog, Sentry, etc.)

**Performance Optimizations:**
- Database indexes on critical queries (8 indexes on tickets, promos, clicks, users)
- HTTP cache headers for public endpoints (5min profiles, 1min promotions)
- Code splitting with React.lazy and Suspense for reduced initial bundle size
- Single Google Font (Inter) instead of 25 families (~60% LCP improvement)

### Database Design
The application uses Drizzle ORM with **Supabase PostgreSQL** as the database (Neon-backed for serverless compatibility), defined with a clear schema in shared/schema.ts. The data model consists of:
- **Users & Profiles**: Core authentication and public-facing user information
- **Links & Clicks**: User-managed review links with click tracking and analytics
- **Promos, Tickets & PublicPages**: Promotional campaigns with ticket generation and custom landing pages
- **PromotionalContacts**: Database of customers who requested promotions
- **PasswordResets & ScanLogs**: Supporting tables for password recovery and ticket scanning

All schemas include proper foreign key relationships with cascade deletion for data integrity. Connection pooling is enabled via Neon serverless driver for optimal serverless performance.

### Development & Build Pipeline
The monorepo structure separates client, server, and shared concerns:
- **Client**: Vite-powered React app with TypeScript, builds to static assets for Vercel hosting
- **API**: Serverless functions in `/api` directory, auto-deployed as Vercel Functions
- **Shared**: Common types, schemas, and utilities shared between client and serverless backend
- **Database**: Drizzle ORM with Neon PostgreSQL (connection pooling for serverless)

**Local Development**: `npm run dev` starts Express server with full routing (for local testing). 
**Production Deployment**: Vercel builds frontend and deploys 8 consolidated serverless functions. See `VERCEL_DEPLOY_COMPLETE.md` for complete deployment instructions.

**Vercel Free Tier Compliance**:
- ✅ 8/12 serverless functions (66% capacity)
- ✅ Pathname-based routing for route consolidation
- ✅ Automatic rewrites configured in `vercel.json`
- ✅ All 31 API endpoints functional

## External Dependencies

### Core Runtime
- Node.js 20 as the JavaScript runtime environment
- Express.js for HTTP server and API routing
- Vite for frontend development server and build tooling

### Database & ORM
- Drizzle ORM for type-safe database operations
- SQLite as the development database (configurable via DATABASE_URL)
- Drizzle Kit for schema migrations and database management

### Authentication & Security  
- jsonwebtoken for JWT token generation and verification
- bcryptjs for password hashing and verification
- cookie-parser for HTTP cookie handling

### UI Framework & Components
- React 18 with TypeScript for component architecture
- Radix UI primitives for accessible component foundations
- shadcn/ui component library for pre-built UI elements
- TailwindCSS for utility-first styling system

### State Management & Data Fetching
- TanStack React Query for server state management and caching
- React Hook Form with Zod for form handling and validation
- Wouter for lightweight client-side routing

### Development Tools
- TypeScript for static type checking across the entire stack
- PostCSS with Autoprefixer for CSS processing
- Various @types packages for TypeScript definitions

### Environment Configuration
The application expects the following environment variables:
- DATABASE_URL: Database connection string (defaults to SQLite file)
- JWT_SECRET: Secret key for JWT token signing
- NODE_ENV: Environment mode (development/production)
- FRONTEND_URL: Frontend URL for CORS configuration (production only)