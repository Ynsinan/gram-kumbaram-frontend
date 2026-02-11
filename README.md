# Gold Portfolio Tracker Frontend

A Next.js 14+ application for tracking physical gold investments with real-time price data and portfolio management.

> **For AI-Assisted Development**: This project includes a [`CLAUDE.md`](./CLAUDE.md) file with detailed architecture, coding conventions, and business logic for AI-assisted development with Claude Code.

## Features

- **Public Access**: Live gold price ticker and profit calculator
- **Authenticated Access**: Personal portfolio dashboard and transaction history
- **Feature-Based Architecture**: Code organized by business domain
- **Modern Stack**: Next.js 14+ App Router, TypeScript, Redux Toolkit, Tailwind CSS, Shadcn UI

## Tech Stack

- **Next.js 14+** with App Router
- **TypeScript** (Strict mode)
- **Redux Toolkit** + RTK Query for state management
- **Tailwind CSS** + Shadcn UI for styling
- **Feature-Based Architecture** (code organized by business domain)

## Prerequisites

- Node.js 18+
- Backend API running (see [backend repository](../physical-golden-wallet-backend))

## Getting Started

### 1. Clone and Install

```bash
git clone <repo-url>
cd physical-golden-wallet-frontend
npm install
```

### 2. Environment Setup

**IMPORTANT:** The backend must be configured with proper OAuth credentials first. See backend's [OAUTH_SETUP.md](../physical-golden-wallet-backend/OAUTH_SETUP.md).

#### For Local Development

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

#### For Production

Production environment variables are in `.env.production`:

```env
NEXT_PUBLIC_API_URL=https://api.gramkumbaram.com
```

### 3. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### 4. Build for Production

```bash
npm run build
```

This creates a static export in the `out/` directory, ready for deployment to Dokploy.

## Available Scripts

```bash
# Development
npm run dev          # Start development server at http://localhost:3000

# Production
npm run build        # Build static export for production
npm run lint         # Run ESLint

# Note: This project uses static export (output: 'export')
# No npm start command is needed - use a web server to serve the out/ directory
```

## Project Structure

See [CLAUDE.md](./CLAUDE.md) for detailed architecture documentation.

```
src/
├── app/              # Next.js App Router (routing only)
├── views/            # Page-level components
├── features/         # Business logic by domain (auth, portfolio, etc.)
├── shared/           # Reusable components, hooks, utilities
├── store/            # Redux store configuration
└── styles/           # Global styles
```

## Environment Variables

| Variable | Description | Local | Production |
|----------|-------------|-------|------------|
| `NEXT_PUBLIC_API_URL` | Backend API base URL | `http://localhost:4000` | `https://api.gramkumbaram.com` |

## OAuth Configuration

This frontend requires a properly configured backend with Google OAuth. The OAuth setup is handled entirely by the backend.

**If you encounter `redirect_uri_mismatch` errors:**
1. See backend's [OAUTH_SETUP.md](../physical-golden-wallet-backend/OAUTH_SETUP.md)
2. Ensure you have separate OAuth clients for local and production
3. Verify callback URLs match exactly in Google Console

## Development Guidelines

- **All files MUST use kebab-case** (e.g., `login-button.tsx`)
- **NO barrel exports** - Import directly from source files
- **Use early returns** to avoid nested conditionals
- **Only Tailwind CSS** for styling (no inline styles)
- **Event handlers MUST have `handle` prefix** (e.g., `handleClick`)

See [CLAUDE.md](./CLAUDE.md) for complete coding conventions.

## Deployment

### Docker Deployment (Dokploy)

```bash
# Build Docker image
docker build -t gold-portfolio-frontend .

# Run container
docker run -p 3000:80 gold-portfolio-frontend
```

The Dockerfile uses a multi-stage build:
1. Builds the Next.js static export
2. Serves it with nginx

### Environment Variables in Production

Production environment variables are baked into the build. Make sure `.env.production` is configured before building.

## Troubleshooting

### OAuth redirect_uri_mismatch

This error means the backend's OAuth configuration doesn't match Google Console settings.

**Solution:**
1. Check backend's [OAUTH_SETUP.md](../physical-golden-wallet-backend/OAUTH_SETUP.md)
2. Verify you're using the correct OAuth Client (local vs production)
3. Ensure callback URLs in Google Console exactly match backend's `GOOGLE_CALLBACK_URL`

### API Connection Issues

If the frontend can't connect to the backend:
1. Verify backend is running: `curl http://localhost:4000/health`
2. Check `NEXT_PUBLIC_API_URL` in `.env.local`
3. Ensure CORS is properly configured in the backend

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Shadcn UI](https://ui.shadcn.com/)

## License

ISC
