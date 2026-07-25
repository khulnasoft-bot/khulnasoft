# Environment Variables Fix - Complete Guide

## What Was Fixed

The application was failing on startup with this error:
```
Missing required environment variables:
  - DATABASE_URL
  - REDIS_HOST
  - REDIS_PORT
  - GITHUB_APP_ID
  - GITHUB_CLIENT_ID
  - GITHUB_CLIENT_SECRET
```

## Changes Made

### 1. **Improved Configuration Validation** (`src/config/index.ts`)
   - Made GitHub variables **optional in development** (required in production only)
   - Added helpful error messages with actionable next steps
   - Provided default values for Redis if not specified
   - Clear distinction between dev and production requirements

### 2. **Updated Development Environment** (`.env.development.local`)
   - Filled in default PostgreSQL connection string
   - Added local Redis defaults
   - Clearly marked optional variables (GitHub, Firebase, Gemini)
   - Added helpful comments about Docker setup

### 3. **Docker Compose Setup** (`docker-compose.yml`)
   - PostgreSQL 15 container with automatic initialization
   - Redis 7 container for queue system
   - Health checks for both services
   - Persistent volumes for data
   - Proper networking for inter-service communication

### 4. **Enhanced npm Scripts** (`package.json`)
   - `npm run docker:up` - Start PostgreSQL and Redis
   - `npm run docker:down` - Stop containers
   - `npm run docker:logs` - View container logs
   - `npm run dev:docker` - Start Docker and dev server

### 5. **Setup Guide** (`SETUP.md`)
   - Quick start instructions (Docker recommended)
   - Manual local setup alternative
   - Environment variable reference
   - Troubleshooting section
   - Command reference

### 6. **Environment Validator** (`src/utils/validateEnv.ts`)
   - Reusable validation function
   - Customizable required/optional variables
   - Better error messages
   - Can be used in other files

## How to Use - Three Options

### Option 1: Docker (Fastest - Recommended ⚡)

```bash
# One command to start everything
npm run docker:up

# Then start the dev server
npm run dev

# App runs at http://localhost:3000
```

**Advantages:**
- No local PostgreSQL/Redis installation needed
- Works identically across all operating systems
- Easy to clean up: `npm run docker:down`
- Matches production environment more closely

---

### Option 2: Local Installation (Manual)

```bash
# 1. Install PostgreSQL and Redis locally
brew install postgresql redis  # macOS
# or: sudo apt-get install postgresql redis-server  # Linux

# 2. Create the database
createdb khulnasoft

# 3. Environment file is already set up
# .env.development.local is ready to use

# 4. Start services
brew services start postgresql redis  # macOS
# or: sudo systemctl start postgresql redis-server  # Linux

# 5. Run dev server
npm run dev
```

**Advantages:**
- Direct control over services
- Easier to debug locally
- No Docker overhead

---

### Option 3: Environment Variables Only (Minimal)

If you have PostgreSQL and Redis running elsewhere:

```bash
# Set your custom connection strings
export DATABASE_URL="postgresql://user:pass@host:5432/khulnasoft"
export REDIS_HOST="host"
export REDIS_PORT="6379"

# Start dev server
npm run dev
```

---

## Verifying Setup

### Check if services are running:

```bash
# Test PostgreSQL
psql -U postgres -d khulnasoft -c "SELECT 1"

# Test Redis
redis-cli ping
# Should respond: PONG
```

### Check environment variables:

```bash
# View all set variables
env | grep -E "(DATABASE|REDIS|GITHUB|GEMINI|NODE_ENV|PORT)"
```

### Test the application:

```bash
# Start dev server
npm run dev

# You should see:
# ✅ Environment variables validated
# ✅ Database connection successful
# ✅ Redis connection successful
# Server running at http://localhost:3000
```

---

## Optional Variables

### GitHub Integration
To enable GitHub features, set these variables (optional for development):
```
GITHUB_APP_ID=your_app_id
GITHUB_CLIENT_ID=your_client_id
GITHUB_CLIENT_SECRET=your_client_secret
GITHUB_WEBHOOK_SECRET=your_webhook_secret
```

### Google Gemini AI
To enable AI features:
```
GEMINI_API_KEY=your_gemini_api_key
```

### Firebase
To enable Firebase integration:
```
FIREBASE_API_KEY=your_api_key
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=your_email
FIREBASE_PRIVATE_KEY=your_private_key
```

### Feature Flags
```
ENABLE_AI_ANALYSIS=true    # Enable/disable AI analysis
DEBUG_MODE=false            # Enable debug logging
```

---

## Troubleshooting

### Problem: "Connection refused" for PostgreSQL

```bash
# Check if PostgreSQL is running
brew services list | grep postgresql

# Start it
brew services start postgresql

# Or use Docker
npm run docker:up
```

### Problem: "Redis connection failed"

```bash
# Check if Redis is running
brew services list | grep redis

# Start it
brew services start redis

# Or use Docker
npm run docker:up
```

### Problem: "Port 3000 already in use"

```bash
# Find what's using the port
lsof -i :3000

# Kill the process
kill -9 <PID>

# Or use a different port
PORT=3001 npm run dev
```

### Problem: TypeScript compilation errors

The code has some TypeScript errors that need fixing. These are separate from environment issues:

```bash
# View all errors
npm run type-check

# Run linter
npm run lint
```

These errors are in the route handlers and need refactoring (see QUICK_FIXES.md or REFACTORING_ROADMAP.md).

---

## Next Steps

1. **Choose your setup method** above and follow it
2. **Verify services are running**
3. **Run `npm run dev`** to start development server
4. **Visit `http://localhost:3000`** in your browser

## Files Changed

- `src/config/index.ts` - Improved environment validation
- `.env.development.local` - Added local development defaults
- `docker-compose.yml` - NEW: Docker setup for services
- `package.json` - Added docker and dev commands
- `SETUP.md` - NEW: Complete setup guide
- `src/utils/validateEnv.ts` - NEW: Reusable validator utility

## Related Documentation

- **SETUP.md** - Detailed setup instructions
- **QUICK_FIXES.md** - 10 immediate code improvements
- **REFACTORING_ROADMAP.md** - Architecture improvements
- **ANALYSIS_SUMMARY.md** - Project analysis overview
