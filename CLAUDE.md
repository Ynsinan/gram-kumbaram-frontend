# Gold Portfolio Tracker Frontend

> Next.js 14+ (App Router) | TypeScript | Redux Toolkit + RTK Query | Tailwind CSS + Shadcn UI

**Feature-Based Architecture** - Code organized by business value, not technical type.

## Quick Reference

### Commands
- `npm run dev` - Start development server (http://localhost:3000)
- `npm run build` - Build for production (static export for Dokploy)
- `npm run lint` - Run ESLint

### Key Directories
- `src/app/` - Next.js App Router (routing only, minimal logic)
- `src/views/` - Page-level components (imported by app routes)
- `src/features/` - Business logic and domain-specific components
- `src/shared/` - Reusable components, hooks, utilities
- `src/store/` - Redux store configuration

### Critical Rules
- **ALL files MUST use kebab-case** (e.g., `login-button.tsx`, `auth-slice.ts`)
- **NO barrel exports** - Import directly from source files, NO `index.ts`
- **Use early returns** to avoid nested conditionals
- **Only Tailwind CSS** for styling, NEVER inline styles
- **Event handlers MUST have `handle` prefix** (e.g., `handleClick`)

---

## Project Overview

**Type**: Frontend Web Application
**Purpose**: Public gold price tracking + Guest calculator + Authenticated portfolio management

**Access Model**:
- **Public**: Landing page, Live Ticker, Profit Calculator (no database)
- **Private**: Dashboard, Transaction History (requires Google Login)

**Deployment**: Dockerized static export for Dokploy

---

## Architecture: Feature-Based Organization

Organize code by **Business Value (Feature)**, not technical type (components, hooks, utils).

### Folder Structure

```text
src/
├── app/                  # Next.js App Router (Routing Only)
│   ├── layout.tsx        # Root Layout (Providers)
│   ├── page.tsx          # Imports from @/views/landing/landing-page
│   ├── (auth)/...        # Route groups
│   └── dashboard/...
├── views/                # Page-Level Components (Views)
│   ├── landing/
│   │   └── landing-page.tsx
│   ├── dashboard/
│   │   └── dashboard-page.tsx
│   └── auth/
│       ├── login-page.tsx
│       └── callback-page.tsx
├── features/             # Business Logic & Domain Components
│   ├── auth/
│   │   ├── auth-api.ts           # RTK Query API
│   │   ├── auth-slice.ts         # Redux slice
│   │   ├── types.ts
│   │   └── components/
│   │       ├── login-button.tsx
│   │       ├── protected-route.tsx
│   │       └── user-menu.tsx
│   ├── market/
│   │   ├── prices-api.ts
│   │   ├── types.ts
│   │   └── components/
│   │       └── gold-price-ticker.tsx
│   ├── portfolio/
│   │   ├── portfolio-api.ts
│   │   ├── types.ts
│   │   └── components/
│   │       ├── portfolio-summary.tsx
│   │       └── portfolio-table.tsx
│   ├── calculator/
│   │   └── components/
│   │       └── profit-calculator.tsx
│   └── transactions/
│       ├── transactions-api.ts
│       ├── types.ts
│       └── components/
│           ├── transaction-form.tsx
│           └── transaction-table.tsx
├── shared/               # Reusable / Generic Code
│   ├── ui/               # Shadcn Components (kebab-case)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── header.tsx
│   │   └── theme-toggle.tsx
│   ├── hooks/
│   │   ├── use-auth.ts
│   │   └── use-theme.ts
│   ├── utils/
│   │   └── helpers.ts    # cn(), formatCurrency, etc.
│   └── api/
│       └── base-api.ts
├── store/                # Redux Store Configuration
│   ├── store.ts
│   ├── store-provider.tsx
│   └── hooks.ts          # useAppDispatch, useAppSelector
└── styles/
    └── globals.css
```

---

## Code Conventions

### 1. Early Returns (Required)

Use early returns to avoid nested conditionals and improve readability.

```typescript
// ✅ Good - Early return
const MyComponent = ({ user }: Props) => {
  if (!user) return null;
  if (user.isLoading) return <Loading />;

  return <UserProfile user={user} />;
};

// ❌ Bad - Nested conditionals
const MyComponent = ({ user }: Props) => {
  return (
    <>
      {user ? (
        user.isLoading ? <Loading /> : <UserProfile user={user} />
      ) : null}
    </>
  );
};
```

### 2. Tailwind Styling (Required)

Always use Tailwind CSS classes for styling. NEVER use inline CSS styles or `<style>` tags.

Use `cn()` utility from `@/shared/utils/helpers` for conditional classes.

```typescript
// ✅ Good - cn() for conditional classes
import { cn } from "@/shared/utils/helpers";

<div className={cn(
  "flex items-center gap-2",
  isActive && "bg-primary text-white",
  isDisabled && "opacity-50 cursor-not-allowed"
)} />

// ❌ Bad - Ternary in className
<div className={`flex items-center gap-2 ${isActive ? "bg-primary" : ""}`} />

// ❌ Bad - Inline styles
<div style={{ display: "flex", alignItems: "center" }} />
```

### 3. File Naming & Imports (Strict)

**ALL files MUST use kebab-case** (e.g., `login-button.tsx`, `auth-slice.ts`)
**NO barrel exports** - Do NOT use `index.ts` files

```typescript
// ✅ Good - Direct imports with kebab-case files
import { LoginButton } from "@/features/auth/components/login-button";
import { useAuth } from "@/shared/hooks/use-auth";
import { cn, formatCurrency } from "@/shared/utils/helpers";

// ❌ Bad - Barrel imports (index.ts)
import { LoginButton } from "@/features/auth";
import { useAuth } from "@/shared/hooks";

// ❌ Bad - PascalCase file names
import { LoginButton } from "@/features/auth/components/LoginButton";
```

### 4. Variable & Function Naming

Event handler functions MUST have `handle` prefix.

```typescript
// ✅ Good - Descriptive names with handle prefix
const handleClick = () => { ... };
const handleSubmit = () => { ... };
const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => { ... };

// ❌ Bad - Missing handle prefix
const onClick = () => { ... };
const submit = () => { ... };
```

### 5. Arrow Functions & Types

Use `const` with arrow functions and always define TypeScript types.

```typescript
// ✅ Good - Arrow function with type
type HandleClickProps = {
  id: string;
  action: "edit" | "delete";
};

const handleClick = ({ id, action }: HandleClickProps) => {
  // ...
};

// ❌ Bad - Function declaration without types
function handleClick(id, action) {
  // ...
}
```

### 6. Accessibility (a11y)

Interactive elements MUST have proper accessibility attributes.

```typescript
// ✅ Good - Accessible button
<button
  onClick={handleClick}
  onKeyDown={handleKeyDown}
  aria-label="Sepete ekle"
  disabled={isLoading}
>
  <ShoppingCart className="h-4 w-4" />
</button>

// ✅ Good - Accessible clickable div (when button isn't suitable)
<div
  role="button"
  tabIndex={0}
  onClick={handleClick}
  onKeyDown={(e) => e.key === "Enter" && handleClick()}
  aria-label="Ürünü seç"
>
  ...
</div>

// ❌ Bad - Missing accessibility
<div onClick={handleClick}>
  <ShoppingCart />
</div>
```

### 7. Component Structure Order

Components should follow this order:

1. Imports
2. Types/Interfaces
3. Component definition
4. Hooks (useState, useEffect, custom hooks)
5. Derived state / memoized values
6. Event handlers
7. Early returns (loading, error states)
8. Main render

```typescript
"use client";

import { useState, useMemo } from "react";
import { Button } from "@/shared/ui/button";
import type { User } from "./types";

interface UserCardProps {
  user: User;
  onEdit: (id: string) => void;
}

export const UserCard = ({ user, onEdit }: UserCardProps) => {
  // 1. Hooks
  const [isExpanded, setIsExpanded] = useState(false);

  // 2. Derived state
  const fullName = useMemo(() => `${user.firstName} ${user.lastName}`, [user]);

  // 3. Event handlers
  const handleToggleExpand = () => {
    setIsExpanded((prev) => !prev);
  };

  const handleEditClick = () => {
    onEdit(user.id);
  };

  // 4. Early returns
  if (!user) return null;

  // 5. Main render
  return (
    <div className="rounded-lg border p-4">
      <h3>{fullName}</h3>
      <Button onClick={handleEditClick} aria-label="Kullanıcıyı düzenle">
        Düzenle
      </Button>
    </div>
  );
};
```

---

## State Management

### Redux Toolkit Structure

- **Store**: `src/store/store.ts` - Configure store with slices and RTK Query
- **Slices**: `src/features/[domain]/[domain]-slice.ts` - Domain state management
- **API**: `src/features/[domain]/[domain]-api.ts` - RTK Query endpoints
- **Hooks**: `src/store/hooks.ts` - Typed `useAppDispatch` and `useAppSelector`

### Redux Toolkit + RTK Query Pattern

```typescript
// features/auth/auth-api.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_API_URL }),
  endpoints: (builder) => ({
    getCurrentUser: builder.query<User, void>({
      query: () => ({
        url: "/auth/me",
        headers: { Authorization: `Bearer ${getToken()}` },
      }),
    }),
  }),
});

export const { useGetCurrentUserQuery } = authApi;
```

---

## API Integration

### Backend Connection

**Base URL**: `http://localhost:3001` (or `NEXT_PUBLIC_API_URL` env variable)
**Authentication**: Bearer token in `Authorization` header

### Key Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/auth/google` | Initiate Google OAuth | No |
| GET | `/auth/me` | Get current user | Yes |
| GET | `/api/prices` | Get all gold prices | No |
| GET | `/api/prices/:goldType` | Get specific gold price | No |
| POST | `/api/transactions` | Create transaction | Yes |
| GET | `/api/transactions` | List user transactions | Yes |
| GET | `/api/portfolio` | Get portfolio with P/L | Yes |

### API Call Pattern with RTK Query

```typescript
// In component
const { data, isLoading, error } = useGetPortfolioQuery();

if (isLoading) return <Loading />;
if (error) return <Error message={error.message} />;

return <PortfolioSummary data={data} />;
```

---

## Development Workflow

### Environment Variables

Create `.env.local` file at project root:

```bash
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_FRONTEND_URL=http://localhost:3000
```

### Running the App

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:3000 in browser
```

### Building for Production

```bash
# Build static export for Dokploy
npm run build

# Output directory: out/
```

### Docker Deployment

```bash
# Build Docker image
docker build -t gold-portfolio-frontend .

# Run container
docker run -p 3000:80 gold-portfolio-frontend
```

---

## Theme & UI

**Dark/Light Mode**: Implemented with `next-themes`
**UI Components**: Shadcn UI (Tailwind-based)
**Theme Toggle**: Available in header via `theme-toggle.tsx`

---

## Summary

This is a **feature-based Next.js 14+ application** with strict conventions:

- **kebab-case files**, no barrel exports
- **Early returns**, no nested conditionals
- **Tailwind only**, no inline styles
- **`handle` prefix** for event handlers
- **Accessibility** (a11y) required for all interactive elements
- **Redux Toolkit** for state, RTK Query for API
- **Component order**: hooks → derived state → handlers → early returns → render
