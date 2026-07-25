# KhulnaSoft: Quick Fixes (Implement Today!)

These are immediate fixes you can apply **right now** to improve the codebase without waiting for the full monorepo refactoring.

---

## 1. ✅ Add `.env.example` (5 minutes)

**Problem:** No environment setup documentation, developers don't know what env vars are needed.

**File: `.env.example`**
```bash
# Core Configuration
NODE_ENV=development
PORT=3000

# Database Connection
DATABASE_URL=postgresql://user:password@localhost:5432/khulnasoft

# Redis Queue Configuration
REDIS_HOST=localhost
REDIS_PORT=6379

# GitHub App Configuration
GITHUB_APP_ID=123456
GITHUB_CLIENT_ID=your_client_id
GITHUB_CLIENT_SECRET=your_client_secret
GITHUB_WEBHOOK_SECRET=your_webhook_secret

# Firebase Configuration
FIREBASE_API_KEY=your_api_key
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=your_email
FIREBASE_PRIVATE_KEY=your_private_key

# Google Gemini AI
GEMINI_API_KEY=your_gemini_key

# Feature Flags
ENABLE_AI_ANALYSIS=true
DEBUG_MODE=false
DISABLE_HMR=false
```

**Then add to `.gitignore`:**
```
.env.local
.env.*.local
.env
!.env.example
```

---

## 2. ✅ Add Environment Validation (10 minutes)

**Problem:** Missing env vars cause cryptic errors. No validation at startup.

**File: `src/config/index.ts`** (NEW)
```typescript
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const requiredEnvVars = [
  'DATABASE_URL',
  'REDIS_HOST',
  'REDIS_PORT',
  'GITHUB_APP_ID',
  'GITHUB_CLIENT_ID',
  'GITHUB_CLIENT_SECRET',
];

const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error('❌ Missing required environment variables:');
  missingVars.forEach(v => console.error(`  - ${v}`));
  console.error('\n📝 Copy .env.example to .env and fill in the values');
  process.exit(1);
}

console.log('✓ Environment variables validated');

export const config = {
  nodeEnv: (process.env.NODE_ENV || 'development') as 'development' | 'production' | 'test',
  port: Number(process.env.PORT || 3000),
  database: {
    url: process.env.DATABASE_URL!,
  },
  redis: {
    host: process.env.REDIS_HOST!,
    port: Number(process.env.REDIS_PORT!),
  },
  github: {
    appId: process.env.GITHUB_APP_ID!,
    clientId: process.env.GITHUB_CLIENT_ID!,
    clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    webhookSecret: process.env.GITHUB_WEBHOOK_SECRET!,
  },
  gemini: {
    apiKey: process.env.GEMINI_API_KEY || undefined,
  },
  features: {
    aiAnalysis: process.env.ENABLE_AI_ANALYSIS !== 'false',
    debug: process.env.DEBUG_MODE === 'true',
  },
};
```

**Update `server.ts` (top):**
```typescript
import { config } from './src/config';
// ... rest of file uses config.port, config.database.url, etc.
```

---

## 3. ✅ Add Missing npm Scripts (5 minutes)

**Update `package.json` scripts:**
```json
{
  "scripts": {
    "dev": "tsx server.ts",
    "dev:debug": "tsx --inspect-brk server.ts",
    "build": "vite build && esbuild server.ts --bundle --platform=node --format=cjs --packages=external --sourcemap --outfile=dist/server.cjs",
    "start": "node dist/server.cjs",
    "preview": "vite preview",
    "clean": "rm -rf dist node_modules",
    "lint": "tsc --noEmit",
    "type-check": "tsc --noEmit --pretty",
    "db:migrate": "drizzle-kit migrate",
    "db:studio": "drizzle-kit studio",
    "db:seed": "tsx scripts/seed.ts",
    "db:reset": "rm -f *.db *.db-shm *.db-wal && npm run db:migrate",
    "test": "vitest",
    "test:ui": "vitest --ui"
  }
}
```

---

## 4. ✅ Create API Error Handler (15 minutes)

**Problem:** Inconsistent error handling, API routes return different error formats.

**File: `src/api/middleware/error-handler.ts`** (NEW)
```typescript
import { Request, Response, NextFunction } from 'express';

export interface ApiError extends Error {
  statusCode?: number;
  details?: any;
}

export class NotFoundError extends Error implements ApiError {
  statusCode = 404;
  constructor(message: string = 'Not found') {
    super(message);
  }
}

export class ValidationError extends Error implements ApiError {
  statusCode = 400;
  constructor(message: string, public details: any) {
    super(message);
  }
}

export class UnauthorizedError extends Error implements ApiError {
  statusCode = 401;
  constructor(message: string = 'Unauthorized') {
    super(message);
  }
}

export function createErrorHandler() {
  return (err: any, req: Request, res: Response, next: NextFunction) => {
    const isDevelopment = process.env.NODE_ENV === 'development';
    
    // Log error
    console.error('[API Error]', {
      path: req.path,
      method: req.method,
      error: err.message,
      statusCode: err.statusCode || 500,
      ...(isDevelopment && { stack: err.stack }),
    });

    const statusCode = err.statusCode || 500;
    const response = {
      success: false,
      error: err.message || 'Internal Server Error',
      ...(isDevelopment && err.details && { details: err.details }),
      ...(isDevelopment && { stack: err.stack }),
    };

    res.status(statusCode).json(response);
  };
}

export function asyncHandler(fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
```

**Update `server.ts`:**
```typescript
import { createErrorHandler, asyncHandler } from './src/api/middleware/error-handler';

// ... existing code ...

// ✅ Add at the end, before app.listen:
app.use(createErrorHandler());

app.listen(PORT, () => {
  console.log(`✓ Server running on http://localhost:${PORT}`);
});
```

---

## 5. ✅ Add Basic Request Validation (20 minutes)

**Problem:** No validation on API inputs, can accept garbage data.

**File: `src/api/middleware/validation.ts`** (NEW)
```typescript
import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
import { ValidationError } from './error-handler';

export function validateBody(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const validated = schema.parse(req.body);
      req.body = validated;
      next();
    } catch (error: any) {
      next(new ValidationError('Request validation failed', error.issues));
    }
  };
}

export function validateQuery(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const validated = schema.parse(req.query);
      req.query = validated;
      next();
    } catch (error: any) {
      next(new ValidationError('Query validation failed', error.issues));
    }
  };
}

export function validateParams(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const validated = schema.parse(req.params);
      req.params = validated;
      next();
    } catch (error: any) {
      next(new ValidationError('Params validation failed', error.issues));
    }
  };
}
```

**Install Zod (if not installed):**
```bash
npm install zod
```

**Create basic schemas:**

**File: `src/api/schemas/index.ts`** (NEW)
```typescript
import { z } from 'zod';

// Repository queries
export const repositoryFilterSchema = z.object({
  q: z.string().optional(),
  language: z.string().optional(),
  framework: z.string().optional(),
  projectType: z.string().optional(),
  maturity: z.string().optional(),
  visibility: z.enum(['public', 'private', 'all']).optional(),
});

// Sync requests
export const syncRequestSchema = z.object({
  orgName: z.string().min(1, 'Organization name required'),
  syncType: z.enum(['full', 'incremental']).optional().default('full'),
});

// GitHub App creation
export const createGitHubAppSchema = z.object({
  name: z.string().min(1),
  appId: z.string().optional(),
  orgName: z.string().min(1),
  clientId: z.string().optional(),
  clientSecret: z.string().optional(),
  webhookSecret: z.string().optional(),
  permissions: z.any().optional(),
});

// Analysis request
export const analysisRequestSchema = z.object({
  repoId: z.string().min(1, 'Repository ID required'),
  depth: z.enum(['shallow', 'medium', 'deep']).default('medium'),
});
```

---

## 6. ✅ Add API Documentation Comments (10 minutes)

**Update `server.ts` routes with JSDoc:**
```typescript
/**
 * GET /api/repositories
 * @description Get repository catalog with optional filtering
 * @query {string} q - Search query (name, description, topics)
 * @query {string} language - Filter by language
 * @query {string} framework - Filter by framework
 * @returns {Object} { success: boolean, count: number, repositories: Repository[] }
 * @example
 * GET /api/repositories?language=TypeScript&framework=React
 */
app.get('/api/repositories', (req, res) => {
  // ... existing code
});

/**
 * POST /api/sync
 * @description Trigger organization discovery & sync
 * @body {string} orgName - GitHub organization name
 * @returns {Object} { success: boolean, syncedAt: ISO8601, stats: Object }
 * @example
 * POST /api/sync
 * { "orgName": "khulnasoft" }
 */
app.post('/api/sync', (req, res) => {
  // ... existing code
});
```

---

## 7. ✅ Fix Dependency Issues (15 minutes)

**Current `package.json` problems:**
- `esbuild` & `vite` in dependencies (should be devDependencies)
- No version consistency
- Missing some peer dependencies

**Update `package.json`:**
```json
{
  "dependencies": {
    "@google/genai": "^2.4.0",
    "@tailwindcss/vite": "^4.1.14",
    "@vitejs/plugin-react": "^5.0.4",
    "d3": "^7.9.0",
    "dotenv": "^17.2.3",
    "drizzle-orm": "^0.45.2",
    "express": "^4.21.2",
    "firebase": "^12.16.0",
    "firebase-admin": "^14.2.0",
    "idb-keyval": "^6.3.0",
    "ioredis": "^5.3.0",
    "lucide-react": "^0.546.0",
    "motion": "^12.23.24",
    "pg": "^8.22.0",
    "react": "^19.0.1",
    "react-dom": "^19.0.1",
    "bullmq": "^5.2.0",
    "zod": "^3.22.0"
  },
  "devDependencies": {
    "@types/d3": "^7.4.3",
    "@types/express": "^4.17.21",
    "@types/node": "^22.14.0",
    "@types/pg": "^8.20.0",
    "@types/react": "^19.2.17",
    "@types/react-dom": "^19.2.3",
    "autoprefixer": "^10.4.21",
    "drizzle-kit": "^0.31.10",
    "esbuild": "^0.25.0",
    "tailwindcss": "^4.1.14",
    "tsx": "^4.21.0",
    "typescript": "~5.8.2",
    "vite": "^6.2.3"
  }
}
```

**Then:**
```bash
npm install
# or
pnpm install
```

---

## 8. ✅ Add Database Connection Logging (5 minutes)

**File: `src/db/index.ts`** (Update)
```typescript
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

const poolConfig = {
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
};

console.log('[DB] Connecting to database...');
const pool = new Pool(poolConfig);

pool.on('connect', () => {
  console.log('✓ Database pool connection established');
});

pool.on('error', (err) => {
  console.error('✗ Database pool error:', err);
});

export const db = drizzle(pool, { schema });

// Health check
export async function checkDatabaseHealth() {
  try {
    await db.execute('SELECT 1');
    console.log('✓ Database connection healthy');
    return true;
  } catch (error) {
    console.error('✗ Database connection failed:', error);
    return false;
  }
}
```

---

## 9. ✅ Add Startup Health Checks (10 minutes)

**File: `src/startup.ts`** (NEW)
```typescript
import { config } from './config';
import { checkDatabaseHealth } from './db';
import { checkRedisHealth } from './queue';

export async function runStartupChecks() {
  console.log('🚀 Running startup checks...\n');

  const checks = [
    {
      name: 'Database',
      fn: checkDatabaseHealth,
    },
    {
      name: 'Redis',
      fn: checkRedisHealth,
    },
  ];

  let allHealthy = true;

  for (const check of checks) {
    try {
      const result = await check.fn();
      if (!result) {
        allHealthy = false;
      }
    } catch (error: any) {
      console.error(`✗ ${check.name}: ${error.message}`);
      allHealthy = false;
    }
  }

  if (!allHealthy) {
    console.error('\n⚠️  Some services are not healthy. Continuing anyway...\n');
  } else {
    console.log('\n✓ All startup checks passed!\n');
  }

  return allHealthy;
}
```

**Update `server.ts`:**
```typescript
import { runStartupChecks } from './src/startup';

// ... after dotenv.config()

async function start() {
  await runStartupChecks();
  
  app.listen(PORT, () => {
    console.log(`✓ Server running on http://localhost:${PORT}`);
  });
}

start().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
```

---

## 10. ✅ Add TypeScript strict mode fixes (20 minutes)

**Update `tsconfig.json`:**
```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "noImplicitThis": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true
  }
}
```

---

## 🎯 Quick Implementation Checklist

Apply these fixes in order:

- [ ] **1. Add `.env.example`** (5 min)
- [ ] **2. Add environment validation** (10 min)
- [ ] **3. Add npm scripts** (5 min)
- [ ] **4. Add error handler** (15 min)
- [ ] **5. Add request validation** (20 min)
- [ ] **6. Add API documentation** (10 min)
- [ ] **7. Fix dependencies** (15 min)
- [ ] **8. Add DB logging** (5 min)
- [ ] **9. Add startup checks** (10 min)
- [ ] **10. Fix TypeScript config** (20 min)

**Total time: ~95 minutes = 1.5 hours**

After these fixes:
✅ Better error handling  
✅ Input validation  
✅ Clear env setup  
✅ Better debugging  
✅ Type safety  
✅ Startup reliability  

Then proceed with the full monorepo refactoring in `REFACTORING_ROADMAP.md` for architectural improvements.
