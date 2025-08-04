
# Advanced Inventory Management System

A comprehensive inventory management system built with Next.js, TypeScript, Prisma, and PostgreSQL. Features real-time tracking, advanced analytics, role-based authentication, and enterprise-grade security.

---

## Table of Contents

## Table of Contents

1. [Features](#features)
   1. [Core Functionality](#core-functionality)
   2. [Authentication & Security](#authentication--security)
   3. [User Experience](#user-experience)
   4. [Admin Features](#admin-features)
2. [Technology Stack](#technology-stack)
3. [Prerequisites](#prerequisites)
4. [Getting Started](#getting-started)
   1. [Clone and Install](#1-clone-and-install)
   2. [Environment Setup](#2-environment-setup)
   3. [Database Setup](#3-database-setup)
   4. [Run Development Server](#4-run-development-server)
5. [Database Schema](#database-schema)
6. [User Roles & Permissions](#user-roles--permissions)
7. [Key Features Explained](#key-features-explained)
8. [Development Commands](#development-commands)
9. [API Endpoints](#api-endpoints)
10. [UI Components](#ui-components)
11. [Security Features](#security-features)
12. [Analytics Dashboard](#analytics-dashboard)
13. [Deployment](#deployment)
14. [Contributing](#contributing)


---

## Features

### 1. Core Functionality

* Advanced inventory tracking (UUID, categories, sources, quantities, expiry, pricing)
* Smart alerts for low stock and expiry dates
* Soft delete system with `deletedAt` timestamp
* Custom categories with admin CRUD
* Audit logging with full change tracking

### 2. Authentication & Security

* Multiple authentication methods:

  * Google OAuth
  * Email/password (bcrypt)
  * OTP via email
* Role-based access (USER & ADMIN)
* Account activation/deactivation
* JWT-based session management with NextAuth.js

### 3. User Experience

* Dark mode with system theme support
* Mobile-first responsive design with Tailwind CSS
* Performance optimizations:

  * React Suspense
  * Skeleton loaders
  * Server-side pagination
* List and card view toggle
* Advanced search with filters

### 4. Admin Features

* User management (create/edit/delete/reset password)
* Category management (CRUD)
* System analytics dashboard
* Full audit trail and activity logs

---

## Technology Stack

* **Frontend**: Next.js 14, TypeScript, Tailwind CSS
* **Backend**: Next.js API Routes, Prisma ORM
* **Database**: PostgreSQL (Neon)
* **Authentication**: NextAuth.js
* **Email**: Nodemailer (SMTP)
* **Validation**: Zod
* **Charts**: Recharts
* **UI**: Radix UI

---

## Prerequisites

* Node.js 18+
* PostgreSQL database (Neon recommended)
* Google OAuth credentials
* SMTP email credentials

---

## Getting Started

### 1. Clone and Install

```bash
git clone <repository-url>
cd inventory-management-system
npm install
```

### 2. Environment Setup

Create `.env.local`:

```env
DATABASE_URL="postgresql://username:password@host:port/database"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
EMAIL_USER="your-email@gmail.com"
EMAIL_PASSWORD="your-app-password"
```

### 3. Database Setup

```bash
npx prisma generate
npx prisma db push
npx prisma db seed
```

### 4. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

---

## Database Schema

### Core Models

#### User

```prisma
model User {
  id            String    @id @default(cuid())
  name          String?
  email         String    @unique
  password      String?
  role          Role      @default(USER)
  status        Status    @default(ACTIVE)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  deletedAt     DateTime? // Soft delete
}
```

#### InventoryItem

```prisma
model InventoryItem {
  id               String    @id @default(cuid())
  itemName         String
  brand            String
  categoryId       String
  source           Source
  destination      String?
  quantity         Int
  description      String?
  expiryDate       DateTime  @default(dbgenerated("'9999-12-31'::date"))
  unitPrice        Decimal?
  lastModifiedBy   String
  createdAt        DateTime  @default(now())
  updatedAt        DateTime  @updatedAt
  deletedAt        DateTime? // Soft delete
}
```

#### Category

```prisma
model Category {
  id        String   @id @default(cuid())
  name      String   @unique
  createdBy String
  createdAt DateTime @default(now())
  deletedAt DateTime? // Soft delete
}
```

---

## User Roles & Permissions

### USER

* Manage own inventory
* Add/edit/delete own items
* Access personal dashboard
* View public catalog

### ADMIN

* All USER permissions
* Manage users (create/edit/delete/activate)
* Manage categories
* Access analytics & audit logs
* Reset user passwords

---

## Key Features Explained

### 1. Soft Delete System

* Keeps deleted records for recovery
* Filtered from queries by default
* Admins can restore items

### 2. Smart Alerts

* Red: expired or critical stock
* Orange: expiring within 30 days
* Yellow: stock < 10

### 3. OTP Authentication

* 6-digit email-based codes
* 10-minute expiration
* Delivered securely via SMTP

### 4. Pagination & Performance

* Server-side pagination
* Skeleton loaders
* Optimized database queries
* Progressive loading with React Suspense

---

## Development Commands

```bash
# Dev server
npm run dev

# Database
npm run db:push
npm run db:seed
npm run db:studio
npm run db:generate

# Production
npm run build
npm start
```

---

## API Endpoints

### Authentication

* `POST /api/auth/signup` – Register user
* `POST /api/auth/otp/send` – Send OTP
* `POST /api/auth/otp/verify` – Verify OTP

### Inventory

* `GET /api/inventory` – Paginated list
* `POST /api/inventory` – Create item
* `PUT /api/inventory/[id]` – Update item
* `DELETE /api/inventory/[id]` – Soft delete

### Admin

* `GET /api/admin/users` – List users
* `PUT /api/admin/users/[id]` – Update user
* `DELETE /api/admin/users/[id]` – Soft delete user

---

## UI Components

* Role-based responsive navigation
* Custom data tables (sortable/filterable)
* Confirmation modals
* Toast notifications
* Skeleton placeholders

---

## Security Features

* Password hashing with bcrypt
* Input validation using Zod
* SQL injection protection (Prisma ORM)
* CSRF protection via NextAuth.js
* API rate limiting

---

## Analytics Dashboard

* Inventory value and item count
* Bar charts by category
* Pie charts for stock levels
* Daily trend visualizations
* Low stock and expiry alerts

---

## Deployment

### Vercel (Recommended)

1. Connect your GitHub repo
2. Add environment variables
3. Deploy directly via Vercel

### Manual Deployment

```bash
npm run build
npm start
```

---

## Contributing

1. Fork the repository
2. Create your branch:

   ```bash
   git checkout -b feature/amazing-feature
   ```
3. Commit your changes:

   ```bash
   git commit -m 'Add amazing feature'
   ```
4. Push to GitHub:

   ```bash
   git push origin feature/amazing-feature
   ```
5. Submit a Pull Request


## Future Improvement Features

* Admin panel for managing users
* Profile settings for each user
* Password recovery option for users/admin before login
* Ability to activate or deactivate user accounts
* Display images for each inventory item
* Enhanced UI/UX, including better skeleton loading view for items, cards, lists, and dashboard
* Toggle between public and private views for enterprise use
* Customer-focused features optimized for purchasing items (e.g., purpose-based recommendations, e-commerce integration)



## Current Error Documentation
![Error Page](docs/error_page.png)

Update: A current bug occasionally causes an error to appear on the page (as shown in the image above). Simply refreshing or reloading the page will resolve the issue.