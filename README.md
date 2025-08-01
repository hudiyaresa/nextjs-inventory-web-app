# Advanced Inventory Management System

A comprehensive inventory management system built with Next.js, TypeScript, Prisma, and PostgreSQL. Features real-time tracking, advanced analytics, role-based authentication, and enterprise-grade security.

## Features

### Core Functionality
- **Advanced Inventory Tracking**: Complete item management with UUID, categories, sources, quantities, expiry dates, and pricing
- **Smart Alerts**: Low stock warnings and expiry date notifications with conditional formatting
- **Soft Delete**: All records use soft delete (deletedAt timestamp) for data recovery
- **Custom Categories**: Admin-managed category system with full CRUD operations
- **Audit Logging**: Complete change tracking with user attribution

### Authentication & Security
- **Multiple Auth Methods**: 
  - Google OAuth integration
  - Email/Password with bcrypt hashing
  - OTP (One-Time Password) via email
- **Role-Based Access**: USER and ADMIN roles with granular permissions
- **Account Management**: User activation/deactivation system
- **Session Management**: Secure JWT-based sessions with NextAuth.js

### User Experience
- **Dark Theme**: Default dark mode with system preference support
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Performance Optimized**: 
  - React Suspense for partial rendering
  - Skeleton loaders for better perceived performance
  - Pagination for large datasets
- **Multiple View Types**: Toggle between list and card views
- **Advanced Search**: Multi-attribute search and filtering

### Admin Features
- **User Management**: Create, edit, delete users and reset passwords
- **Category Management**: Full CRUD operations for inventory categories
- **System Analytics**: Comprehensive dashboard with charts and statistics
- **Audit Trail**: View all system changes and user activities

## 🛠 Technology Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL (Neon hosting)
- **Authentication**: NextAuth.js with Google OAuth
- **Email**: Nodemailer with SMTP
- **Validation**: Zod schema validation
- **Charts**: Recharts for data visualization
- **UI Components**: Radix UI primitives

## Prerequisites

- Node.js 18+ 
- PostgreSQL database (Neon recommended)
- Google OAuth credentials
- SMTP email credentials

## Getting Started

### 1. Clone and Install
\`\`\`bash
git clone <repository-url>
cd inventory-management-system
npm install
\`\`\`

### 2. Environment Setup
Create `.env.local`:
\`\`\`env
# Database
DATABASE_URL="postgresql://username:password@host:port/database"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Email (SMTP)
EMAIL_USER="your-email@gmail.com"
EMAIL_PASSWORD="your-app-password"
\`\`\`

### 3. Database Setup
\`\`\`bash
# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# Seed database with sample data
npx prisma db seed
\`\`\`

### 4. Run Development Server
\`\`\`bash
npm run dev
\`\`\`

Visit `http://localhost:3000`

## Database Schema

### Core Models

#### User
\`\`\`prisma
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
\`\`\`

#### InventoryItem
\`\`\`prisma
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
\`\`\`

#### Category
\`\`\`prisma
model Category {
  id        String   @id @default(cuid())
  name      String   @unique
  createdBy String
  createdAt DateTime @default(now())
  deletedAt DateTime? // Soft delete
}
\`\`\`

## User Roles & Permissions

### USER Role
- View and manage own inventory items
- Add new inventory items
- Edit/delete own items
- View public catalog
- Access personal dashboard

### ADMIN Role
- All USER permissions
- Manage all users (create, edit, delete, activate/deactivate)
- Manage categories (create, edit, delete)
- View system-wide analytics
- Access audit logs
- Reset user passwords

## Key Features Explained

### Soft Delete System
All deletions are soft deletes using `deletedAt` timestamp:
- Records remain in database for recovery
- Filtered out from normal queries
- Admin can view/restore deleted items

### Smart Alerts
Conditional formatting for inventory items:
- **Red**: Expired items or critical low stock
- **Orange**: Items expiring within 30 days
- **Yellow**: Low stock warnings (< 10 items)

### OTP Authentication
Email-based OTP system:
- 6-digit codes with 10-minute expiry
- Secure SMTP delivery via Nodemailer
- Alternative to password authentication

### Pagination & Performance
- Server-side pagination for large datasets
- Skeleton loaders during data fetching
- React Suspense for progressive loading
- Optimized database queries

## Development Commands

\`\`\`bash
# Development
npm run dev

# Database
npm run db:push      # Push schema changes
npm run db:seed      # Seed database
npm run db:studio    # Open Prisma Studio
npm run db:generate  # Generate Prisma client

# Build
npm run build
npm start
\`\`\`

## API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/otp/send` - Send OTP
- `POST /api/auth/otp/verify` - Verify OTP

### Inventory
- `GET /api/inventory` - List items (paginated)
- `POST /api/inventory` - Create item
- `PUT /api/inventory/[id]` - Update item
- `DELETE /api/inventory/[id]` - Soft delete item

### Admin
- `GET /api/admin/users` - List users
- `PUT /api/admin/users/[id]` - Update user
- `DELETE /api/admin/users/[id]` - Soft delete user

## UI Components

Built with Radix UI primitives and custom components:
- Responsive navigation with role-based menus
- Advanced data tables with sorting/filtering
- Modal dialogs for confirmations
- Toast notifications for user feedback
- Skeleton loaders for better UX

## Security Features

- **Password Hashing**: bcrypt with salt rounds
- **Input Validation**: Zod schemas on client and server
- **SQL Injection Protection**: Prisma ORM parameterized queries
- **CSRF Protection**: NextAuth.js built-in protection
- **Rate Limiting**: Built-in API route protection

## Analytics Dashboard

Real-time charts and statistics:
- Total inventory value and count
- Items by category (bar chart)
- Stock level distribution (pie chart)
- Daily additions trend
- Low stock and expiry alerts

## Deployment

### Vercel (Recommended)
1. Connect GitHub repository
2. Add environment variables
3. Deploy automatically

### Manual Deployment
\`\`\`bash
npm run build
npm start
\`\`\`

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

