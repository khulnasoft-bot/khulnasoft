# Khulnasoft Development Setup Guide

## Prerequisites

- Node.js 18+ and npm/pnpm
- Docker & Docker Compose (optional but recommended)
- PostgreSQL 15+ (if not using Docker)
- Redis 7+ (if not using Docker)

## Quick Start (Recommended)

### Option 1: Using Docker Compose (Fastest ⚡)

```bash
# Start PostgreSQL and Redis in Docker
npm run docker:up

# Install dependencies
npm install

# Run development server
npm run dev
```

The app will be available at `http://localhost:3000`

View logs: `npm run docker:logs`

### Option 2: Manual Local Setup

1. **Install PostgreSQL and Redis locally**
   - macOS: `brew install postgresql redis`
   - Linux: `sudo apt-get install postgresql redis-server`
   - Windows: Download installers from postgresql.org and redis.io

2. **Create local environment file**
   ```bash
   cp .env.example .env.development.local
   ```

3. **Update `.env.development.local` with your local connection details**
   ```
   DATABASE_URL=postgresql://postgres:password@localhost:5432/khulnasoft
   REDIS_HOST=localhost
   REDIS_PORT=6379
   ```

4. **Create PostgreSQL database**
   ```bash
   createdb khulnasoft
   ```

5. **Install dependencies and start**
   ```bash
   npm install
   npm run dev
   ```

## Environment Variables

### Required (Development)
- `DATABASE_URL` - PostgreSQL connection string
- `REDIS_HOST` - Redis hostname
- `REDIS_PORT` - Redis port

### Optional (Development)
- `GITHUB_APP_ID` - GitHub App ID (for GitHub integration)
- `GITHUB_CLIENT_ID` - GitHub OAuth Client ID
- `GITHUB_CLIENT_SECRET` - GitHub OAuth Client Secret
- `GITHUB_WEBHOOK_SECRET` - GitHub Webhook Secret
- `GEMINI_API_KEY` - Google Gemini API key (for AI features)

### Feature Flags
- `ENABLE_AI_ANALYSIS=true|false` - Enable/disable AI analysis (default: true)
- `DEBUG_MODE=true|false` - Enable debug logging (default: false)

## Available Commands

```bash
# Development
npm run dev              # Start dev server with HMR
npm run dev:debug       # Start with Node debugger

# Docker (if using Docker Compose)
npm run docker:up       # Start PostgreSQL and Redis
npm run docker:down     # Stop Docker containers
npm run docker:logs     # View Docker logs

# Database
npm run db:migrate      # Run database migrations
npm run db:studio       # Open Drizzle Studio GUI
npm run db:seed         # Seed sample data
npm run db:reset        # Reset database

# Quality
npm run lint            # Check TypeScript types
npm run type-check      # Full type checking
npm run test            # Run tests
npm run test:ui         # Run tests with UI

# Production
npm run build           # Build for production
npm run start           # Start production server
npm run preview         # Preview production build
```

## Troubleshooting

### "Missing required environment variables"

**Solution:**
```bash
# Copy example environment file
cp .env.example .env.development.local

# Or use Docker (easiest)
npm run docker:up
```

### PostgreSQL Connection Refused

**Check if PostgreSQL is running:**
```bash
# macOS
brew services list | grep postgresql

# Linux
sudo systemctl status postgresql

# Or use Docker
npm run docker:up
```

**Fix connection string:**
- Local: `postgresql://user:password@localhost:5432/khulnasoft`
- Docker: Keep as `localhost:5432` (Docker Desktop automatically forwards)
- Remote: Use full connection string from your provider

### Redis Connection Failed

**Check if Redis is running:**
```bash
# macOS
brew services list | grep redis

# Linux
sudo systemctl status redis-server

# Or use Docker
npm run docker:up

# Test connection
redis-cli ping  # Should respond "PONG"
```

### Port 3000 Already in Use

```bash
# Find what's using port 3000
lsof -i :3000

# Kill the process (macOS/Linux)
kill -9 <PID>

# Or use a different port
PORT=3001 npm run dev
```

### Vercel Integration Issues

If you see `AI_GATEWAY_API_KEY` or other Vercel variables, these are auto-injected in the Vercel environment and not needed locally.

## Database Migrations

### Create a migration
```bash
# Make schema changes in src/db/schema.ts
# Then generate migration
npm run db:migrate
```

### View database in GUI
```bash
npm run db:studio
# Opens Drizzle Studio at http://local.drizzle.studio
```

## GitHub Integration Setup (Optional)

To use GitHub features:

1. Create a GitHub App: https://github.com/settings/apps/new
2. Set these environment variables:
   ```
   GITHUB_APP_ID=your_app_id
   GITHUB_CLIENT_ID=your_client_id
   GITHUB_CLIENT_SECRET=your_client_secret
   GITHUB_WEBHOOK_SECRET=your_webhook_secret
   ```
3. Restart dev server: `npm run dev`

## AI Features Setup (Optional)

To enable Google Gemini AI:

1. Get API key: https://ai.google.dev/
2. Set environment variable:
   ```
   GEMINI_API_KEY=your_api_key
   ```
3. Restart dev server: `npm run dev`

## Next Steps

- Read `ANALYSIS_SUMMARY.md` for architecture overview
- Check `REFACTORING_ROADMAP.md` for development roadmap
- See `QUICK_FIXES.md` for immediate improvements

## Getting Help

1. Check logs: `npm run dev` (shows startup checks)
2. Run type check: `npm run type-check`
3. Check database: `npm run db:studio`
4. View Docker logs: `npm run docker:logs`

## Production Deployment

See Vercel deployment docs: https://vercel.com/docs

All environment variables must be set in Vercel project settings before deploying.
