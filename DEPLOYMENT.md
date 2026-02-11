# Deployment Guide

## Environment Configuration

Bu proje local development ve production ortamları için farklı env konfigürasyonlarına sahiptir.

### Environment Files

- **`.env.local`** - Local development ortamı için (git'e commit edilmez)
- **`.env.production`** - Production build için (git'e commit edilmez)
- **`.env.example`** - Örnek template dosyası (git'e commit edilir)

### Available Environment Variables

| Variable | Description | Local Default | Production Default |
|----------|-------------|---------------|-------------------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | `http://localhost:4000` | `https://api.gramkumbaram.com` |
| `NEXT_PUBLIC_API_TIMEOUT` | API request timeout (ms) | `30000` | `30000` |
| `NEXT_PUBLIC_FRONTEND_URL` | Frontend URL | `http://localhost:3000` | `https://gramkumbaram.com` |
| `NEXT_PUBLIC_ENABLE_DEBUG` | Debug mode flag | `true` | `false` |
| `NEXT_PUBLIC_ENABLE_MOCK_API` | Mock API flag | `false` | `false` |

### Setup Instructions

#### 1. Local Development

```bash
# Copy example file
cp .env.example .env.local

# Edit .env.local with your local settings
# .env.local already has correct local defaults
```

#### 2. Production Build

```bash
# .env.production is already configured with production defaults
# No action needed for local production builds
npm run build
```

---

## Docker Deployment

### Building with Default Production Settings

```bash
# Build with default production values from Dockerfile
docker build -t gold-portfolio-frontend .
```

### Building with Custom Environment Variables

```bash
# Build with custom API URL
docker build \
  --build-arg NEXT_PUBLIC_API_URL=https://api.example.com \
  --build-arg NEXT_PUBLIC_FRONTEND_URL=https://example.com \
  --build-arg NEXT_PUBLIC_ENABLE_DEBUG=false \
  -t gold-portfolio-frontend .
```

### Running the Container

```bash
# Run on port 3000
docker run -p 3000:3000 gold-portfolio-frontend

# Run on port 80 (production)
docker run -p 80:3000 gold-portfolio-frontend
```

---

## Dokploy Deployment

### Method 1: Using .env.production (Recommended)

Dokploy automatically uses `.env.production` during build:

```bash
# 1. Push your code to git repository
git add .
git commit -m "Update production config"
git push

# 2. In Dokploy dashboard:
#    - Connect your repository
#    - Dokploy will automatically use .env.production
#    - No additional env vars needed
```

### Method 2: Using Build Args

Alternatif olarak, Dokploy dashboard'dan build args ekleyebilirsiniz:

```
Build Args:
NEXT_PUBLIC_API_URL=https://api.gramkumbaram.com
NEXT_PUBLIC_FRONTEND_URL=https://gramkumbaram.com
NEXT_PUBLIC_ENABLE_DEBUG=false
```

---

## Environment Management Best Practices

### 1. Never Commit Secrets

```bash
# .gitignore already includes:
.env.local
.env.production
.env*.local
```

### 2. Use Centralized Config

All environment variables are centralized in `src/shared/config/env.ts`:

```typescript
import { env } from "@/shared/config/env";

// Always use env config instead of process.env
const apiUrl = env.API_URL;  // ✅ Good
const apiUrl = process.env.NEXT_PUBLIC_API_URL;  // ❌ Avoid
```

### 3. Validate Environment

The config automatically validates required variables on startup:

```typescript
import { validateEnv } from "@/shared/config/env";

// Called automatically in app initialization
validateEnv();
```

### 4. Debug Environment

In development, you can log the current config:

```typescript
import { logEnvConfig } from "@/shared/config/env";

// Only logs in development mode
logEnvConfig();
```

---

## Troubleshooting

### Issue: Environment variables not updating

**Solution:** Next.js caches env vars during build. Restart dev server or rebuild:

```bash
# Development
rm -rf .next
npm run dev

# Production
rm -rf .next out
npm run build
```

### Issue: Different values in browser vs server

**Solution:** Only `NEXT_PUBLIC_*` variables are available in browser. Make sure your variable has the correct prefix.

### Issue: Docker build using wrong env values

**Solution:** Make sure you're passing build args correctly:

```bash
# Correct
docker build --build-arg NEXT_PUBLIC_API_URL=https://api.example.com .

# Wrong (will use defaults)
docker build -e NEXT_PUBLIC_API_URL=https://api.example.com .
```

---

## Quick Reference

```bash
# Local Development
npm run dev                    # Uses .env.local

# Production Build
npm run build                  # Uses .env.production

# Docker Build (default production)
docker build -t app .          # Uses ARG defaults in Dockerfile

# Docker Build (custom)
docker build --build-arg NEXT_PUBLIC_API_URL=https://api.custom.com -t app .

# Run Docker Container
docker run -p 3000:3000 app
```
