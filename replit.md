# Ninja Kids vs Brainrot Coloring App

## Overview

A playful, child-friendly coloring application where kids can color illustrations featuring ninja kids battling "brainrot" (internet meme) characters. The app provides an interactive canvas with drawing tools, color palettes, and the ability to save artwork. Built with a React frontend and Express backend, using a full-stack TypeScript architecture.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state, React useState/useContext for local state
- **Styling**: Tailwind CSS with CSS variables for theming (light/dark mode support)
- **UI Components**: shadcn/ui component library (Radix UI primitives with custom styling)
- **Animations**: Framer Motion for page transitions and interactions
- **Build Tool**: Vite with HMR support

### Backend Architecture
- **Framework**: Express 5 on Node.js
- **Language**: TypeScript with tsx for development
- **API Design**: RESTful JSON APIs under `/api/*` prefix
- **Storage**: In-memory storage class (MemStorage) with interface for future database migration
- **Database Schema**: Drizzle ORM with PostgreSQL dialect configured (ready for connection)

### Data Flow
1. Frontend makes API requests via TanStack Query
2. Express routes handle requests in `server/routes.ts`
3. Storage layer abstracts data persistence
4. Coloring page data is currently stored as static TypeScript data in `shared/coloring-data.ts`

### Key Design Patterns
- **Monorepo Structure**: Client, server, and shared code in single repository
- **Shared Types**: Common schemas in `shared/schema.ts` using Drizzle and Zod
- **Path Aliases**: `@/` for client code, `@shared/` for shared code
- **Component-First**: Extensive shadcn/ui component library for consistent UI

### Pages and Routes
- `/` - Home page with featured characters and categories
- `/gallery` - Browse all coloring pages with category filtering
- `/color/:id` - Interactive coloring canvas for a specific page

## External Dependencies

### Database
- **Drizzle ORM**: Schema definition and query building
- **PostgreSQL**: Target database (configured in `drizzle.config.ts`, requires `DATABASE_URL` environment variable)
- **connect-pg-simple**: Session storage for PostgreSQL (available but not currently active)

### UI/UX Libraries
- **Radix UI**: Accessible component primitives (dialog, dropdown, tabs, etc.)
- **Framer Motion**: Animation library
- **Lucide React**: Icon library
- **Embla Carousel**: Carousel component

### Build and Development
- **Vite**: Frontend build tool with React plugin
- **esbuild**: Server bundling for production
- **Tailwind CSS**: Utility-first CSS framework
- **TypeScript**: Type checking across the stack

### Fonts (Google Fonts CDN)
- Nunito (primary body text)
- Fredoka (headings)
- Open Sans (fallback)