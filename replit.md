# Code Generator Application

## Overview

This is a full-stack web application that generates code using AI (OpenAI's GPT-5). Users can submit prompts describing what they want to build, select programming languages and frameworks, and receive generated code files with explanations. The application features a modern React frontend with a Node.js/Express backend and uses PostgreSQL for data persistence.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **UI Framework**: Shadcn/ui components built on top of Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming, supports dark mode
- **State Management**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for client-side routing
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js REST API
- **Database ORM**: Drizzle ORM with PostgreSQL dialect
- **Validation**: Zod schemas for request/response validation
- **Development**: Hot reload with Vite middleware in development mode

### Data Storage Solutions
- **Primary Database**: PostgreSQL via Neon Database serverless
- **Schema**: Single table `code_generations` storing prompts, language/framework preferences, generated code files (JSONB), and explanations
- **Fallback Storage**: In-memory storage implementation for development/testing

### Authentication and Authorization
- Currently no authentication system implemented
- All endpoints are publicly accessible
- Sessions managed via `connect-pg-simple` (configured but not actively used)

### Code Generation Service
- **AI Provider**: OpenAI GPT-5 API integration
- **Input**: User prompt, programming language, optional framework
- **Output**: Array of code files with syntax-highlighted content and explanatory text
- **Error Handling**: Comprehensive error handling for API failures and validation errors

### Key Architectural Decisions

**Monorepo Structure**: Single repository with `client/`, `server/`, and `shared/` directories for better code organization and type sharing between frontend and backend.

**Type Safety**: Full TypeScript implementation with shared Zod schemas ensuring type safety across the entire stack from database to UI.

**Component Library**: Shadcn/ui provides a consistent, accessible design system with proper theming support and customizable components.

**Database Schema Design**: Simple flat structure with JSONB for flexible code file storage, avoiding complex relationships while maintaining query performance.

**Development Experience**: Integrated Vite development server with hot reload, error overlays, and Replit-specific tooling for seamless development workflow.

## External Dependencies

### Core Services
- **OpenAI API**: GPT-5 model for code generation (requires `OPENAI_API_KEY` environment variable)
- **Neon Database**: Serverless PostgreSQL hosting (requires `DATABASE_URL` environment variable)

### Frontend Libraries
- **React Ecosystem**: React 18, React DOM, React Hook Form, TanStack Query
- **UI Components**: Radix UI primitives, Lucide React icons, Embla Carousel
- **Styling**: Tailwind CSS, Class Variance Authority, Clsx for conditional styling
- **Utilities**: Date-fns for date manipulation, Wouter for routing

### Backend Libraries
- **Express Framework**: Core server with JSON/URL-encoded parsing
- **Database**: Drizzle ORM, Neon Database serverless client, connect-pg-simple for sessions
- **Validation**: Zod for schema validation, Drizzle-Zod for database schema integration
- **Development**: TSX for TypeScript execution, ESBuild for production builds

### Development Tools
- **Build Tools**: Vite with React plugin, PostCSS with Autoprefixer
- **Replit Integration**: Custom Vite plugins for error modals, dev banners, and cartographer
- **TypeScript**: Comprehensive type checking with strict configuration