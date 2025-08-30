# TapReview - Full-Stack Review Collection Platform

## Overview

TapReview is a full-stack web application designed to help businesses collect customer reviews through NFC technology. The platform enables users to create personalized public profiles where customers can easily leave reviews by tapping an NFC card. The application combines a luxury black and gold theme (#0a0a0a / #CC9900) with modern React components to deliver a premium user experience.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The client-side application is built with React, TypeScript, and Vite, providing a modern development experience with hot module replacement. The UI is constructed using shadcn/ui components built on top of Radix UI primitives, ensuring accessibility and consistency. TailwindCSS provides utility-first styling with custom CSS variables for the luxury theme. State management is handled by TanStack React Query for server state synchronization, while Wouter provides lightweight client-side routing.

### Backend Architecture  
The server runs on Express.js with TypeScript, following a RESTful API design pattern. Routes are modularized in the routes.ts file, with authentication middleware protecting secured endpoints. The storage layer implements an interface-based design (IStorage) with a Prisma implementation, allowing for future database provider flexibility. Error handling is centralized with proper HTTP status codes and JSON responses.

### Authentication & Authorization
Authentication uses JWT tokens stored in HTTP-only cookies with a 30-day expiration. Passwords are hashed using bcryptjs with a salt rounds of 12. The system includes middleware for protected routes (requireAuth) and optional authentication checking (getCurrentUser). Cookie security adapts to environment - secure:false in development, secure:true in production.

### Database Design
The application uses Drizzle ORM with SQLite as the database, defined with a clear schema in shared/schema.ts. The data model consists of three main entities:
- Users: Core authentication and identification
- Profiles: Public-facing user information with customization options  
- Links: User-managed collection of review links with ordering support

All schemas include proper foreign key relationships and cascade deletion for data integrity.

### Development & Build Pipeline
The monorepo structure separates client and server concerns while sharing TypeScript types through a shared directory. Vite handles frontend bundling with proxy configuration for API routes during development. The production build compiles both client (static assets) and server (ESM bundle) with appropriate optimizations.

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