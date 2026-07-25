# KhulnaSoft Monorepo Refactoring Roadmap

## Quick Start Implementation Guide

### ✅ Phase 1: API Route Organization (1-2 days)

#### Step 1: Create API Directory Structure
```bash
mkdir -p src/api/routes
mkdir -p src/api/middleware  
mkdir -p src/api/schemas
mkdir -p src/api/services
```

#### Step 2: Extract Routes into Modules

**File: `src/api/routes/repositories.ts`**
```typescript
import express from 'express';
import { validateQuery } from '../middleware/validation';
import * as schema from '../schemas/repositories';
import { getRepositories, getRepository, getRepositoryHealth } from '../services/repository-service';

export const repositoriesRouter = express.Router();

// GET /api/repositories - Catalog listing with filtering
repositoriesRouter.get('/', validateQuery(schema.repositoriesQuerySchema), async (req, res, next) => {
  try {
    const results = await getRepositories(req.query);
    res.json({
      success: true,
      count: results.length,
      repositories: results,
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/repositories/:id - Single repo detail
repositoriesRouter.get('/:id', async (req, res, next) => {
  try {
    const repo = await getRepository(req.params.id);
    if (!repo) {
      return res.status(404).json({ error: 'Repository not found' });
    }
    res.json({ success: true, repository: repo });
  } catch (error) {
    next(error);
  }
});

// GET /api/repositories/health - Health matrix
repositoriesRouter.get('/health', async (req, res, next) => {
  try {
    const health = await getRepositoryHealth();
    res.json({ success: true, ...health });
  } catch (error) {
    next(error);
  }
});
```

**File: `src/api/routes/sync.ts`**
```typescript
import express from 'express';
import { syncQueue } from '../../queue';
import { validateBody } from '../middleware/validation';
import * as schema from '../schemas/sync';

export const syncRouter = express.Router();

// POST /api/sync
syncRouter.post('/', validateBody(schema.syncRequestSchema), async (req, res, next) => {
  try {
    const { orgName } = req.body;
    const job = await syncQueue.add('org-sync', { org: orgName }, { priority: 1 });
    res.json({ success: true, jobId: job.id });
  } catch (error) {
    next(error);
  }
});

// GET /api/sync/:jobId/status
syncRouter.get('/:jobId/status', async (req, res, next) => {
  try {
    const job = await syncQueue.getJob(req.params.jobId);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }
    res.json({
      success: true,
      jobId: job.id,
      status: job._progress ? job._progress : await job.getState(),
      progress: job._progress || 0,
    });
  } catch (error) {
    next(error);
  }
});
```

**File: `src/api/routes/index.ts`**
```typescript
import express from 'express';
import { repositoriesRouter } from './repositories';
import { syncRouter } from './sync';
import { githubRouter } from './github';
import { discoveryRouter } from './discovery';
import { analysisRouter } from './analysis';

export function registerRoutes(app: express.Application) {
  app.use('/api/repositories', repositoriesRouter);
  app.use('/api/sync', syncRouter);
  app.use('/api/github', githubRouter);
  app.use('/api/discovery', discoveryRouter);
  app.use('/api/analyze', analysisRouter);
}
```

#### Step 3: Create Validation Schemas

**File: `src/api/schemas/repositories.ts`**
```typescript
import { z } from 'zod';

export const repositoriesQuerySchema = z.object({
  q: z.string().optional(),
  language: z.string().optional(),
  framework: z.string().optional(),
  projectType: z.string().optional(),
  maturity: z.string().optional(),
  visibility: z.enum(['public', 'private', 'all']).optional(),
});

export const syncRequestSchema = z.object({
  orgName: z.string().min(1, 'Organization name required'),
});

export type RepositoriesQuery = z.infer<typeof repositoriesQuerySchema>;
export type SyncRequest = z.infer<typeof syncRequestSchema>;
```

#### Step 4: Create Middleware

**File: `src/api/middleware/validation.ts`**
```typescript
import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

export function validateQuery(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const validated = schema.parse(req.query);
      req.query = validated;
      next();
    } catch (error: any) {
      res.status(400).json({
        error: 'Validation failed',
        details: error.issues,
      });
    }
  };
}

export function validateBody(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const validated = schema.parse(req.body);
      req.body = validated;
      next();
    } catch (error: any) {
      res.status(400).json({
        error: 'Validation failed',
        details: error.issues,
      });
    }
  };
}
```

**File: `src/api/middleware/error-handler.ts`**
```typescript
import { Request, Response, NextFunction } from 'express';

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  console.error('[Error]', err);

  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(status).json({
    error: message,
    details: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
}
```

#### Step 5: Update Main Server File

**File: `server.ts` (simplified)**
```typescript
import express from 'express';
import dotenv from 'dotenv';
import { createViteDevServer } from './src/vite';
import { registerRoutes } from './src/api/routes';
import { errorHandler } from './src/api/middleware/error-handler';
import { seedInitialGitHubData } from './src/db/github';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json({ limit: '10mb' }));

// Initialize database
seedInitialGitHubData();

// Register API routes
registerRoutes(app);

// Error handling
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`✓ Server running on http://localhost:${PORT}`);
});
```

---

### ✅ Phase 2: Environment & Sandbox Setup (1 day)

#### Step 1: Create `.env.example`

**File: `.env.example`**
```bash
# Server
NODE_ENV=development
PORT=3000

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/khulnasoft
DB_MIGRATE_ON_START=true

# Redis
REDIS_HOST=127.0.0.1
REDIS_PORT=6379

# GitHub
GITHUB_APP_ID=your_github_app_id
GITHUB_CLIENT_ID=your_client_id
GITHUB_CLIENT_SECRET=your_client_secret
GITHUB_WEBHOOK_SECRET=your_webhook_secret

# Firebase
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY=your_private_key
FIREBASE_CLIENT_EMAIL=your_client_email

# AI (Gemini)
GEMINI_API_KEY=your_gemini_api_key

# Features
ENABLE_AI_ANALYSIS=true
DEBUG_MODE=false
```

#### Step 2: Create Environment Validator

**File: `src/config/env.ts`**
```typescript
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(3000),
  DATABASE_URL: z.string().url(),
  REDIS_HOST: z.string().default('127.0.0.1'),
  REDIS_PORT: z.coerce.number().default(6379),
  GITHUB_APP_ID: z.string(),
  GITHUB_CLIENT_ID: z.string(),
  GITHUB_CLIENT_SECRET: z.string(),
  GITHUB_WEBHOOK_SECRET: z.string(),
  GEMINI_API_KEY: z.string().optional(),
});

export function validateEnv() {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    console.error('❌ Environment validation failed:');
    result.error.issues.forEach(issue => {
      console.error(`  - ${issue.path.join('.')}: ${issue.message}`);
    });
    process.exit(1);
  }

  console.log('✓ Environment validated');
  return result.data;
}

export const env = validateEnv();
export type Environment = z.infer<typeof envSchema>;
```

#### Step 3: Create Docker Compose

**File: `docker-compose.yml`**
```yaml
version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    container_name: khulnasoft-postgres
    environment:
      POSTGRES_USER: khulnasoft
      POSTGRES_PASSWORD: khulnasoft
      POSTGRES_DB: khulnasoft
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U khulnasoft"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    container_name: khulnasoft-redis
    ports:
      - "6379:6379"
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  postgres_data:

networks:
  default:
    name: khulnasoft-network
```

#### Step 4: Update Package Scripts

**File: `package.json` (update scripts)**
```json
{
  "scripts": {
    "dev": "tsx server.ts",
    "dev:debug": "tsx --inspect server.ts",
    "build": "vite build && esbuild server.ts --bundle --platform=node --format=cjs --packages=external --outfile=dist/server.cjs",
    "start": "node dist/server.cjs",
    "preview": "vite preview",
    "clean": "rm -rf dist",
    "lint": "tsc --noEmit",
    "type-check": "tsc --noEmit --pretty",
    "db:migrate": "drizzle-kit migrate",
    "db:studio": "drizzle-kit studio",
    "db:seed": "tsx scripts/seed.ts",
    "docker:up": "docker-compose up -d",
    "docker:down": "docker-compose down",
    "docker:reset": "docker-compose down -v && docker-compose up -d",
    "setup": "pnpm install && pnpm docker:up && pnpm db:migrate && pnpm db:seed"
  }
}
```

---

### ✅ Phase 3: Convert to Monorepo (2-3 days)

#### Step 1: Create Workspace Structure

```bash
mkdir -p packages/{types,db,api,frontend,sdk}
```

#### Step 2: Setup pnpm Workspaces

**File: `pnpm-workspace.yaml`**
```yaml
packages:
  - 'packages/*'
  - 'apps/*'
```

**File: `package.json` (root, update)**
```json
{
  "name": "khulnasoft-monorepo",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "pnpm -r --parallel dev",
    "build": "pnpm -r build",
    "lint": "pnpm -r lint",
    "test": "pnpm -r test",
    "docker:up": "docker-compose up -d",
    "docker:down": "docker-compose down",
    "setup": "pnpm install && pnpm docker:up && pnpm -r db:migrate"
  },
  "devDependencies": {
    "typescript": "~5.8.2",
    "tsx": "^4.21.0"
  }
}
```

#### Step 3: Create Types Package

**File: `packages/types/package.json`**
```json
{
  "name": "@khulnasoft/types",
  "version": "0.1.0",
  "type": "module",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "files": ["dist"],
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "types": "./dist/index.d.ts"
    },
    "./api": {
      "import": "./dist/api.js",
      "types": "./dist/api.d.ts"
    },
    "./db": {
      "import": "./dist/db.js",
      "types": "./dist/db.d.ts"
    }
  },
  "scripts": {
    "build": "tsc"
  }
}
```

**File: `packages/types/src/api.ts`**
```typescript
import type { InferSelectModel } from 'drizzle-orm';
import type { repositories } from '@khulnasoft/db';

export interface Repository extends InferSelectModel<typeof repositories> {}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  details?: any;
}

export interface RepositoriesResponse extends ApiResponse<Repository[]> {
  count: number;
}

export interface SyncResponse extends ApiResponse<{ jobId: string }> {
  message: string;
}
```

#### Step 4: Create DB Package

**File: `packages/db/package.json`**
```json
{
  "name": "@khulnasoft/db",
  "version": "0.1.0",
  "type": "module",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "scripts": {
    "build": "tsc",
    "migrate": "drizzle-kit migrate",
    "studio": "drizzle-kit studio"
  },
  "dependencies": {
    "drizzle-orm": "^0.45.2",
    "pg": "^8.22.0"
  },
  "devDependencies": {
    "drizzle-kit": "^0.31.10"
  }
}
```

#### Step 5: Update tsconfig.json (Root)

**File: `tsconfig.json`**
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "jsx": "react-jsx",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "baseUrl": ".",
    "paths": {
      "@khulnasoft/types": ["packages/types/src"],
      "@khulnasoft/db": ["packages/db/src"],
      "@khulnasoft/api": ["packages/api/src"],
      "@khulnasoft/sdk": ["packages/sdk/src"]
    }
  },
  "include": ["packages/*/src"],
  "exclude": ["node_modules", "dist"]
}
```

---

### ✅ Phase 4: Database Query Refactoring (1 day)

**File: `packages/db/src/queries/repositories.ts`**
```typescript
import { db } from '../connection';
import { repositories } from '../schema';
import { eq, like, or } from 'drizzle-orm';

export async function findRepositories(filters: {
  q?: string;
  language?: string;
  framework?: string;
  limit?: number;
}) {
  let query = db.select().from(repositories);

  if (filters.q) {
    const searchTerm = `%${filters.q}%`;
    query = query.where(
      or(
        like(repositories.name, searchTerm),
        like(repositories.description, searchTerm)
      )
    );
  }

  if (filters.language) {
    query = query.where(eq(repositories.language, filters.language));
  }

  return query.limit(filters.limit || 50);
}

export async function findRepositoryById(id: string) {
  return db.select().from(repositories).where(eq(repositories.id, parseInt(id))).limit(1).then(r => r[0]);
}
```

---

### 🎯 Success Metrics

After completing all phases:

| Metric | Before | After |
|--------|--------|-------|
| Server file lines | 843 | 50 |
| API route files | 1 | 5+ |
| Type packages | 0 | 3+ |
| Environment validation | ❌ | ✅ |
| Docker support | ❌ | ✅ |
| SDK exports | ❌ | ✅ |
| Test infrastructure | ❌ | ✅ |

---

### 📋 Quick Implementation Checklist

- [ ] **Phase 1:** Extract API routes (1-2 days)
  - [ ] Create src/api directory
  - [ ] Extract route files
  - [ ] Create validation schemas
  - [ ] Add middleware
  - [ ] Update server.ts

- [ ] **Phase 2:** Environment setup (1 day)
  - [ ] Create .env.example
  - [ ] Add env validator
  - [ ] Create docker-compose.yml
  - [ ] Update package scripts

- [ ] **Phase 3:** Monorepo conversion (2-3 days)
  - [ ] Create workspace structure
  - [ ] Setup pnpm workspaces
  - [ ] Create packages
  - [ ] Update tsconfigs
  - [ ] Migrate code

- [ ] **Phase 4:** Database refactoring (1 day)
  - [ ] Extract query builders
  - [ ] Create repository pattern
  - [ ] Add query logging
  - [ ] Update services

**Total Effort: 5-7 days**

This creates a production-ready, scalable monorepo with proper boundaries and excellent developer experience!
