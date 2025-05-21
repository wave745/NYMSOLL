# NymSOL - Solana Domain Search & Vanity Wallet Generator

## Overview

NymSOL is a web application that allows users to search, register and manage Solana domain names (.sol domains), as well as generate vanity Solana wallet addresses. The application is built with a React frontend and an Express backend, using Drizzle ORM for database operations and PostgreSQL for data storage.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

The frontend is built with React and follows a modern, component-based architecture:

- **UI Framework**: Uses Shadcn UI components that are built on top of Radix UI primitives
- **Styling**: TailwindCSS for styling with a custom color theme
- **Routing**: Uses Wouter for lightweight client-side routing
- **State Management**: React Query for server state management and data fetching
- **Animations**: Framer Motion for fluid animations and transitions

### Backend Architecture

The backend is built with Express.js and follows a RESTful API structure:

- **Server**: Express.js for API endpoints and serving the frontend
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Authentication**: Session-based authentication (planned/in progress)
- **External Integrations**: Solana blockchain integration via Solana web3.js library

### Data Storage

- **Database**: PostgreSQL (via Replit's PostgreSQL module)
- **ORM**: Drizzle ORM for type-safe database queries and schema management
- **Schema**: Defined in `shared/schema.ts` with tables for users, domains, and vanity wallets

## Key Components

### Frontend Components

1. **Pages**:
   - `DomainSearch`: Main page for searching and registering Solana domains
   - `VanityWallet`: Tool for generating vanity wallet addresses
   - `Dashboard`: User dashboard for managing domains and wallets

2. **Shared Components**:
   - `NavBar`: Navigation component
   - `IconTextButton`: Custom button component
   - `ThemeProvider`: Dark mode theme provider
   - UI components from Shadcn/Radix UI (toast, dialog, etc.)

3. **Hooks**:
   - `useSolanaWallet`: Custom hook for Solana wallet integration
   - `useToast`: Custom hook for toast notifications
   - Various utility hooks

### Backend Components

1. **API Routes**:
   - Domain search and registration endpoints
   - User management endpoints
   - Vanity wallet management endpoints

2. **Controllers**:
   - `domainController`: Handles domain-related operations
   - User controller (likely planned but not implemented yet)

3. **Database Models**:
   - Users, Domains, and VanityWallets tables

### Shared Components

- `schema.ts`: Shared database schema for both frontend and backend
- Types definitions shared between client and server

## Data Flow

1. **Domain Search Flow**:
   - User inputs a domain name in the search field
   - Frontend sends request to the backend `/api/domains/search` endpoint
   - Backend checks domain availability on the Solana blockchain
   - Response is returned to the frontend and displayed to the user
   - If available, the user can proceed to registration

2. **Vanity Wallet Generation Flow**:
   - User inputs desired wallet address prefix
   - Web worker runs in background to generate keypairs until a match is found
   - Result is displayed to the user who can save the wallet

3. **User Authentication Flow**:
   - Login/signup functionality (appears to be in development)
   - Session-based authentication

## External Dependencies

### Frontend Dependencies

- React ecosystem: React DOM, React Query
- UI: Radix UI components, shadcn/ui, TailwindCSS
- Solana: @solana/web3.js, @bonfida/spl-name-service
- Utilities: date-fns, class-variance-authority, framer-motion

### Backend Dependencies

- Express.js for server
- Drizzle ORM for database operations
- PostgreSQL for data storage

## Deployment Strategy

The application is configured to be deployed on Replit with:

1. **Development Mode**:
   - Uses `npm run dev` command which runs the server with hot-reloading
   - Vite handles frontend development server

2. **Production Mode**:
   - Build step: `npm run build` which bundles both frontend and backend
   - Run step: `npm run start` which runs the production server

The `.replit` configuration includes:
- Node.js 20 and PostgreSQL 16 modules
- Deployment settings for auto-scaling
- Port configuration (5000 locally, 80 externally)

## Database Setup

The database schema includes:
- `users` table for user accounts
- `domains` table for registered Solana domains
- `vanityWallets` table for saved vanity wallet addresses

Drizzle ORM is used with the schema defined in `shared/schema.ts`.

## Getting Started

1. Ensure the DATABASE_URL environment variable is set
2. Run `npm run dev` to start the development server
3. To push schema changes to the database, use `npm run db:push`

## Future Enhancements

Based on the current codebase, potential enhancements could include:
- Completing user authentication flows
- Adding domain management features
- Implementing Solana wallet transaction capabilities
- Adding domain marketplace features