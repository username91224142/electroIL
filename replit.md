# Overview

This is ElectroIsrael - a modern e-commerce application for selling tobacco products and vapes in Israel. The application is built as a full-stack solution with a React frontend, Express.js backend, and PostgreSQL database. The system supports cash-only payments and integrates with Telegram for order notifications and customer communication. It features multi-language support (English, Russian, Hebrew) and includes a comprehensive admin panel for managing products, orders, and inventory.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The frontend uses a React-based architecture with modern tooling:
- **React 18** with TypeScript for type safety
- **Wouter** for lightweight client-side routing
- **TanStack Query** for efficient server state management and caching
- **shadcn/ui** component library with Radix UI primitives for accessible components
- **Tailwind CSS** with custom design system variables for consistent styling
- **React Hook Form** with Zod validation for form handling

The architecture follows a component-based approach with:
- Layout components (Header, Footer, Admin Sidebar)
- Page components for different routes (Home, Catalog, Product, Cart, Checkout, Admin pages)
- Reusable UI components from shadcn/ui
- Custom hooks for cart management and mobile detection
- Internationalization system supporting English, Russian, and Hebrew

## Backend Architecture
The backend implements a REST API using Express.js with:
- **TypeScript** for type safety across the entire stack
- **Drizzle ORM** for database operations with type-safe SQL queries
- **Zod schemas** shared between frontend and backend for validation
- **Modular service architecture** with separate concerns for storage, Telegram integration
- **Session-based authentication** for admin users
- RESTful API design with proper error handling and logging middleware

The server structure includes:
- Route handlers for products, categories, and orders
- Storage abstraction layer for database operations
- Telegram service for order notifications
- Middleware for request logging and error handling

## Database Design
PostgreSQL database with Drizzle ORM provides:
- **Type-safe database schema** defined in TypeScript
- **Relational data model** with proper foreign key relationships
- **UUID primary keys** for better security and distributed systems support
- **Internationalization support** with multi-language fields for products and categories
- **Order management** with proper order items tracking

Key entities:
- Users (admin authentication)
- Categories (with multi-language support)
- Products (with inventory, pricing, and localization)
- Orders (with customer details and order items)
- Order Items (junction table for order-product relationships)

## Authentication & Authorization
Simple admin-only authentication system:
- **Session-based authentication** stored in localStorage
- **Route guards** for admin pages
- **Single admin role** for simplicity (MVP approach)
- No complex user management or customer accounts

## State Management
- **TanStack Query** for server state management with automatic caching and refetching
- **Custom React hooks** for cart state management with localStorage persistence
- **React Context** for language switching and global state
- **Local storage** for cart persistence and authentication state

# External Dependencies

## Database
- **Neon PostgreSQL** - Serverless PostgreSQL database hosted on Neon
- **Drizzle ORM** - Type-safe ORM for database operations
- **Connection pooling** via @neondatabase/serverless for optimal performance

## UI & Styling
- **shadcn/ui** - Modern React component library built on Radix UI
- **Radix UI** - Low-level UI primitives for accessibility
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Modern icon library
- **React Icons** - Additional icon sets (Font Awesome)

## Form Handling & Validation
- **React Hook Form** - Performant forms with easy validation
- **Zod** - TypeScript-first schema validation
- **@hookform/resolvers** - Zod integration with React Hook Form

## Communication
- **Telegram Bot API** - For sending order notifications to @Dark090111
- **Webhook integration** - Automatic order forwarding to Telegram

## Development Tools
- **Vite** - Fast build tool and development server
- **TypeScript** - Static type checking
- **ESM modules** - Modern JavaScript module system
- **Hot Module Replacement** - Fast development iteration

## Hosting & Deployment
- **Replit environment** - Development and potential hosting platform
- **Environment variables** for configuration (DATABASE_URL, TELEGRAM_BOT_TOKEN)
- **Static asset serving** via Express.js in production