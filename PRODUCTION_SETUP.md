# KhulnaSoft Production Setup Guide

This guide covers the production-grade database setup, authentication, and API deployment for KhulnaSoft.

## ✅ Database Setup

### 1. Prerequisites

Ensure you have:
- PostgreSQL database connection (Supabase, Neon, or self-hosted)
- Environment variables configured
- Supabase account (for authentication)

### 2. Environment Configuration

Create `.env.production` with:

```bash
# Database
DATABASE_URL=postgresql://user:password@host:port/database
# Or individual vars:
PGHOST=host
PGPORT=5432
PGUSER=user
PGPASSWORD=password
PGDATABASE=database

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxxxx
SUPABASE_SECRET_KEY=xxxxx
SUPABASE_SERVICE_ROLE_KEY=xxxxx

# Application
NODE_ENV=production
PORT=3000
```

### 3. Run Database Migrations

```bash
# Generate migrations from schema
npm run db:migrate

# Verify setup
npm run db:setup

# View migration history
npm run db:migrate:check
```

### 4. Seed Initial Data (Optional)

The database comes with predefined schemas. To populate test data:

```bash
npm run db:seed
```

## 🔐 Authentication Setup

### 1. Supabase Configuration

1. Go to [Supabase Dashboard](https://supabase.com)
2. Create a new project or use existing
3. Enable authentication providers:
   - Email/Password (built-in)
   - Google OAuth (optional)
   - GitHub OAuth (optional)

### 2. Configure Auth in Application

The application now uses **real Supabase tokens** instead of mock JWTs:

- Tokens are stored in httpOnly cookies (secure by default)
- Sessions are validated on app startup
- Token refresh is automatic
- Logout clears all session data

### 3. Auth Endpoints

```
POST /api/auth/login        # Email/password login
POST /api/auth/register     # Register new account
POST /api/auth/logout       # Logout (clear session)
GET  /api/auth/me           # Get current user
POST /api/auth/refresh      # Refresh token
```

## 🛡️ Protected API Routes

### New Protected Routes (v1 API)

All `/api/v1/*` routes require authentication:

```bash
# Repositories
GET    /api/v1/repositories          # List repositories
GET    /api/v1/repositories/:id      # Get single repository
POST   /api/v1/repositories          # Create repository (validated)
PUT    /api/v1/repositories/:id      # Update repository (validated)
DELETE /api/v1/repositories/:id      # Delete repository

# Notes
GET    /api/v1/notes                 # Get user notes
POST   /api/v1/notes                 # Create note (validated)
PUT    /api/v1/notes/:id             # Update note
DELETE /api/v1/notes/:id             # Delete note
```

### Health Check Endpoints (No Auth)

```bash
GET /api/health              # Basic health check
GET /api/health/db           # Database connectivity check
GET /api/status              # Full system status
GET /api/version             # API version info
```

## 📋 Input Validation

All `/api/v1/*` POST/PUT requests are validated using Zod schemas:

### Repository Creation
```json
{
  "githubRepoId": "string",
  "orgId": 123,
  "name": "string",
  "fullName": "string",
  "language": "TypeScript",
  "frameworks": "React,Express",
  "healthScore": 90,
  "isPrivate": false
}
```

### Note Creation
```json
{
  "repoId": "string",
  "repoName": "string",
  "note": "string (max 5000 chars)",
  "status": "todo|in-progress|done"
}
```

Invalid requests return 400 with validation errors:
```json
{
  "success": false,
  "error": "Invalid repository data",
  "details": [
    { "path": ["name"], "message": "String must be non-empty" }
  ]
}
```

## 🐳 Docker Deployment

### Build Image

```bash
docker build -t khulnasoft:latest .
```

### Run Container

```bash
docker run \
  -e DATABASE_URL=postgresql://... \
  -e NEXT_PUBLIC_SUPABASE_URL=https://... \
  -e NEXT_PUBLIC_SUPABASE_ANON_KEY=... \
  -e NODE_ENV=production \
  -p 3000:3000 \
  khulnasoft:latest
```

### Health Checks

The container includes automatic health checks:
```bash
# Check health
curl http://localhost:3000/api/health

# Check database
curl http://localhost:3000/api/health/db
```

## 📊 Monitoring

### Structured Logging

The application uses structured logging for production debugging:

```bash
# View logs
npm run logs:production

# Filter by service
npm run logs:production -- --filter=database
npm run logs:production -- --filter=auth
```

### Error Tracking

All API errors include:
- Request ID (for tracing)
- Timestamp
- User ID (if authenticated)
- Error message
- Status code

In production, sensitive details are hidden from client responses.

## 🔄 Database Maintenance

### Backup

```bash
# Backup database
pg_dump $DATABASE_URL > backup.sql

# Restore from backup
psql $DATABASE_URL < backup.sql
```

### Migrations

```bash
# View pending migrations
npm run db:migrate:status

# Rollback last migration (if using Drizzle migration system)
npm run db:migrate:rollback
```

### Performance

Monitor database performance:
```bash
# Check slow queries (if using PostgreSQL)
SELECT * FROM pg_stat_statements ORDER BY mean_time DESC;

# Add indexes if needed
CREATE INDEX idx_repo_org_id ON repositories(org_id);
CREATE INDEX idx_notes_user_id ON repository_notes(user_id);
```

## 🚀 Deployment Checklist

- [ ] Database migrations applied (`npm run db:migrate`)
- [ ] Database setup verified (`npm run db:setup`)
- [ ] Supabase auth configured
- [ ] Environment variables set in production
- [ ] Docker image built and tested
- [ ] Health endpoints responding
- [ ] Error handling working (test with invalid requests)
- [ ] Token refresh working (test auth flow)
- [ ] Database backups configured
- [ ] Monitoring/logging configured
- [ ] CORS configured for production domain
- [ ] Rate limiting enabled (if using API Gateway)

## 🆘 Troubleshooting

### Database Connection Errors

```bash
# Test connection
psql $DATABASE_URL -c "SELECT 1"

# Check credentials
echo $DATABASE_URL | grep -o '[^:]*:[^@]*@'

# View connection string
echo $DATABASE_URL
```

### Migration Failures

```bash
# Check migration status
npm run db:migrate:status

# Verify schema
npm run db:setup

# Manual reset (development only!)
npm run db:migrate:reset
```

### Authentication Issues

```bash
# Check Supabase credentials
curl https://YOUR_SUPABASE_URL/auth/v1/health

# Verify tokens in browser console
document.cookie  # Check for auth cookies

# Test token validation
curl -H "Authorization: Bearer $TOKEN" http://localhost:3000/api/v1/notes
```

## 📚 Next Steps

1. **Set up CI/CD**: Deploy on git push using GitHub Actions or Vercel
2. **Add rate limiting**: Use Redis/Upstash for API rate limits
3. **Enable monitoring**: Set up Sentry for error tracking
4. **Implement caching**: Cache frequent queries with Redis
5. **Add tests**: Write integration tests for critical paths

## 📖 API Documentation

Generate API docs:
```bash
npm run docs:generate
```

This creates OpenAPI/Swagger documentation of all endpoints.

---

For more details, see:
- [PRODUCTION_ANALYSIS.md](./PRODUCTION_ANALYSIS.md) - Full analysis report
- [Database Schema](./src/db/schema.ts) - Table definitions
- [Auth Middleware](./src/middleware/auth.ts) - Authentication implementation
- [Error Handling](./src/api/middleware/error-handler.ts) - Error handling patterns
