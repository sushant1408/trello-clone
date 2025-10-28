# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Environment Setup

### Prerequisites
Before running the project, you need to set up accounts and obtain API keys:

1. **Clerk** (Authentication & Multi-tenancy)
   - Create account at https://dashboard.clerk.com
   - Create a new application
   - Copy your Publishable Key and Secret Key

2. **Stripe** (Payment Processing)
   - Create account at https://dashboard.stripe.com
   - Create API keys in the dashboard
   - Set up webhook endpoint for subscription events

3. **MySQL Database**
   - Set up a MySQL database instance
   - Obtain connection string

4. **Unsplash** (Optional - Board Backgrounds)
   - Create account at https://unsplash.com/developers
   - Create an application
   - Copy your Access Key

### Environment Variables

Copy `.env.example` to `.env` and fill in your actual credentials:

```bash
cp .env.example .env
```

**Important**: Never commit `.env` to version control. The `.env.example` file shows the required variables without secrets.

## Development Commands

### Starting Development
```bash
npm run dev           # Start dev server at http://localhost:3008
npm run build         # Build for production
npm start             # Start production server
npm run lint          # Run ESLint
```

### Database Management (Prisma)
```bash
npx prisma studio    # Open visual database UI
npx prisma generate  # Generate Prisma client after schema changes
npx prisma db push   # Sync schema changes to database
```

### Stripe Integration
```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login to Stripe CLI
stripe login

# Forward webhook events to local server
stripe listen --forward-to localhost:3008/api/webhook

# Trigger Stripe events for testing
stripe trigger <event>
```

## High-Level Architecture

This is a **Trello-like Kanban board application** built with Next.js 15 (App Router), featuring multi-tenancy via Clerk, drag-and-drop boards/lists/cards, activity audit logging, and Stripe subscription management.

### Core Tech Stack
- **Framework**: Next.js 15 (App Router, Server Components, Server Actions)
- **Auth & Multi-tenancy**: Clerk (user authentication + organization management)
- **Database**: Prisma ORM with MySQL
- **UI**: Shadcn/Radix UI, Tailwind CSS
- **State Management**: Zustand (UI state), TanStack React Query (server state)
- **Drag & Drop**: @hello-pangea/dnd (React Beautiful DnD fork)
- **Payment**: Stripe API integration
- **Validation**: Zod schemas
- **Images**: Unsplash API for board backgrounds

### Key Data Models (Prisma)

```
Board (owned by organization)
├── List (columns in board)
│   └── Card (items in list)
└── AuditLog (CREATE/UPDATE/DELETE events)

OrganizationLimit (tracks free board count, max=5)
OrganizationSubscription (Stripe subscription data)
```

### Application Structure

```
src/
├── app/                              # Next.js App Router
│   ├── (marketing)/                  # Public pages
│   ├── (main)/
│   │   ├── (auth)/                   # Clerk auth routes
│   │   └── (dashboard)/              # Protected dashboard
│   │       ├── organization/[id]/    # Org boards, billing, settings
│   │       └── board/[id]/           # Kanban board UI
│   └── api/                          # API routes (Stripe webhook, card endpoints)
│
├── actions/                          # Server Actions (create-*, update-*, delete-*)
│   ├── [action-name]/
│   │   ├── index.ts                  # Handler with createSafeAction wrapper
│   │   ├── schema.ts                 # Zod validation schema
│   │   └── types.ts                  # Type definitions from schema
│
├── components/
│   ├── ui/                           # Radix UI shadcn components
│   ├── form/                         # Form input components
│   └── [feature-components]
│
├── hooks/
│   ├── use-action.ts                 # Hook to execute server actions client-side
│   ├── use-card-modal.ts             # Zustand store for card modal state
│   └── [other-custom-hooks]
│
├── lib/
│   ├── create-safe-action.ts         # Server action wrapper (validation + error handling)
│   ├── create-audit-log.ts           # Log CRUD operations
│   ├── organization-limit.ts         # Free board limit (max 5)
│   ├── subscription.ts               # Check Stripe subscription status
│   ├── db.ts                         # Prisma singleton
│   └── [utilities]
│
├── config/
├── constants/
├── types.ts
└── middleware.ts                     # Clerk auth middleware
```

## Architectural Patterns & Key Concepts

### 1. Safe Server Actions Pattern
Every server action follows this structure:

```typescript
// actions/[feature]/schema.ts
export const FeatureSchema = z.object({
  title: z.string().min(1, "Title required"),
  // ...
});

// actions/[feature]/types.ts
export type InputType = z.infer<typeof FeatureSchema>;
export type ReturnType = ActionState<InputType, Model>;

// actions/[feature]/index.ts
const handler = async (data: InputType): Promise<ReturnType> => {
  // Validation happens automatically before handler
  // Use await db.model.create() for mutations
  // Always return ActionState with data or error
};

export const createFeature = createSafeAction(FeatureSchema, handler);
```

**Key Files:**
- `src/lib/create-safe-action.ts` - Wrapper that validates input, catches errors, returns typed ActionState
- `src/hooks/use-action.ts` - Client-side hook to call server actions with loading/error states

### 2. useAction Hook (Client-Side)
Used to execute server actions from client components:

```typescript
const { execute, isLoading, fieldErrors } = useAction(createBoard, {
  onSuccess: (data) => {},
  onError: (error) => {},
  onSettled: () => {},
});

await execute({ title: "New Board" });
```

### 3. Audit Logging
All entity mutations automatically create AuditLog entries:
- File: `src/lib/create-audit-log.ts`
- Logs: action (CREATE/UPDATE/DELETE), entityType (BOARD/LIST/CARD), userId, timestamp

### 4. Freemium Model
- File: `src/lib/organization-limit.ts`
- Max 5 free boards per organization
- `incrementAvailableCount()` / `decrementAvailableCount()` when creating/deleting boards
- `canCreateMore()` checks limit before allowing new board creation

### 5. Stripe Subscription Management
- File: `src/lib/subscription.ts` - `isSubscribed()` checks for active subscription
- Webhook: `/api/webhook` - Updates OrganizationSubscription on subscription events
- Billing page: `/dashboard/organization/[id]/billing/`

### 6. Drag & Drop Implementation
- Uses @hello-pangea/dnd (React Beautiful DnD)
- Components: `list-container.tsx`, `list-item.tsx`, `card-item.tsx`
- Server action: `update-card-order` / `update-list-order` persists drag-drop changes

### 7. Multi-Tenancy via Clerk
- Middleware: `src/middleware.ts` enforces auth and organization selection
- Routes protected unless in public groups: `/`, `/sign-in`, `/sign-up`, `/api/webhook`
- Every query/mutation includes `orgId` for data isolation
- User can switch organizations via org selection UI

## Authentication & Middleware Flow

```
1. Unauthenticated user → redirect to /sign-in
2. Authenticated user without org → redirect to /select-org
3. Authenticated user with org → allow access to /organization/[id]/*
4. Public routes: /, /sign-in, /sign-up, /api/webhook (allowed for all)
```

**Clerk Integration Points:**
- `@clerk/nextjs` provides auth context in components
- `useAuth()` / `useOrganization()` / `useUser()` hooks
- Org selection page: `/sign-up/[[...sign-up]]/` (Clerk-managed)
- User profile/org switching in navbar

## API Endpoints

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/webhook` | POST | Stripe webhook (subscription updates) |
| `/api/cards/[cardId]` | GET | Fetch card details with relationships |
| `/api/cards/[cardId]/logs` | GET | Fetch last 3 audit logs for card |

## Important Implementation Notes

1. **Always use `createSafeAction`** when creating new server actions - never create bare "use server" functions
2. **Include audit logs** for any CREATE/UPDATE/DELETE operation using `createAuditLog()`
3. **Check freemium limits** before allowing board creation - use `canCreateMore()` and `incrementAvailableCount()`
4. **Validate org ownership** - all queries must filter by orgId from user's session
5. **Use useAction hook** for client-side server action calls - provides automatic error/loading handling
6. **Drag-drop state** persists via server actions (`update-card-order`, `update-list-order`) - order field is critical
7. **Card modal** state managed by Zustand (`use-card-modal.ts`) - controlled client-side
8. **Form validation** uses Zod schemas - define in action's schema.ts file
9. **Stripe payment** - subscription status checked via `isSubscribed(orgId)` before allowing unlimited boards

## Common Development Tasks

### Add a New Board Feature
1. Create action in `src/actions/[feature-name]/` (schema, types, handler with createSafeAction)
2. Create Zod validation schema
3. Add audit log in handler via `createAuditLog()`
4. Check org limit if creating boards (use `canCreateMore()`)
5. Create UI component in `src/components/` or page route
6. Use `useAction()` hook in component to call server action

### Modify the Kanban Board
1. Components are in `src/app/(main)/(dashboard)/board/[boardId]/_components/`
2. `list-container.tsx` - Main drag-drop container
3. `card-item.tsx` - Individual card component
4. Reordering uses `update-card-order` / `update-list-order` actions
5. Opening card details triggers card modal via `use-card-modal` Zustand store

### Add Stripe Subscription Feature
1. Add feature check using `isSubscribed(orgId)`
2. Show ProModal (upsell) via `use-pro-modal` Zustand store if not subscribed
3. Update Stripe product/price in Stripe dashboard
4. Add webhook event handler in `/api/webhook` if needed

### Database Schema Changes
1. Update `prisma/schema.prisma`
2. Run `npx prisma db push` to sync
3. Run `npx prisma generate` if client needs regeneration
4. Update types in `src/types.ts` if needed

## Libraries & Dependencies

### Core Framework & Runtime
- `next` (15.1.7) - React framework with Server Components, Server Actions, and App Router
- `react` (19.0.0) - JavaScript library for building user interfaces
- `react-dom` (19.0.0) - React package for working with the DOM

### Authentication & Multi-tenancy
- `@clerk/nextjs` (6.12.0) - User authentication and organization management integration

### Database & ORM
- `@prisma/client` (6.4.1) - Type-safe database client and query builder
- `prisma` (6.4.1) - ORM and database migration tool

### UI Components & Styling
- `@radix-ui/react-accordion` (1.2.3) - Accessible accordion component
- `@radix-ui/react-avatar` (1.1.3) - Accessible avatar component
- `@radix-ui/react-dialog` (1.1.6) - Accessible modal/dialog component
- `@radix-ui/react-label` (2.1.2) - Accessible label component
- `@radix-ui/react-popover` (1.1.6) - Accessible popover component
- `@radix-ui/react-separator` (1.1.2) - Visual separator component
- `@radix-ui/react-slot` (1.1.2) - Slot pattern for component composition
- `@radix-ui/react-tooltip` (1.1.8) - Accessible tooltip component
- `tailwindcss` (3.4.1) - Utility-first CSS framework
- `tailwindcss-animate` (1.0.7) - Tailwind CSS animation utilities
- `tailwind-merge` (3.0.1) - Utility to merge Tailwind CSS classes
- `class-variance-authority` (0.7.1) - Type-safe component variant management
- `clsx` (2.1.1) - Utility for constructing className strings
- `lucide-react` (0.475.0) - Icon library with React components
- `next-themes` (0.4.4) - Theme management for Next.js applications

### Drag & Drop
- `@hello-pangea/dnd` (18.0.1) - Beautiful drag-and-drop library (React Beautiful DnD fork)

### State Management & Data Fetching
- `zustand` (5.0.3) - Lightweight state management library (used for modal and UI state)
- `@tanstack/react-query` (5.66.9) - Server state management and data fetching

### API & Payment Integration
- `stripe` (17.7.0) - Stripe API client for payment processing
- `unsplash-js` (7.0.19) - Unsplash API client for fetching board background images

### Data Validation & Utilities
- `zod` (3.24.2) - TypeScript-first schema validation library
- `date-fns` (4.1.0) - Modern date utility library
- `lodash` (4.17.21) - Utility library with helper functions
- `usehooks-ts` (3.1.1) - Collection of TypeScript-compatible React hooks
- `sonner` (2.0.1) - Toast notification library

### Build & Development Tools
- `typescript` (5) - TypeScript language support
- `eslint` (9) - JavaScript linter
- `eslint-config-next` (15.1.7) - ESLint configuration for Next.js
- `@eslint/eslintrc` (3) - ESLint configuration file parser
- `postcss` (8) - CSS transformation tool

### Type Definitions
- `@types/node` (20) - TypeScript definitions for Node.js
- `@types/react` (19) - TypeScript definitions for React
- `@types/react-dom` (19) - TypeScript definitions for React DOM
- `@types/lodash` (4.17.15) - TypeScript definitions for Lodash
