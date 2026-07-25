import { defineConfig } from 'drizzle-kit';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env.development.local' });
dotenv.config({ path: '/vercel/share/.env.project' });

// Support both individual env vars and DATABASE_URL
const getDatabaseConfig = () => {
  const databaseUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  
  if (databaseUrl) {
    return { url: databaseUrl };
  }

  // Fallback to individual env vars
  return {
    host: process.env.PGHOST || process.env.SQL_HOST || 'localhost',
    port: parseInt(process.env.PGPORT || '5432'),
    user: process.env.PGUSER || process.env.SQL_ADMIN_USER || 'postgres',
    password: process.env.PGPASSWORD || process.env.SQL_ADMIN_PASSWORD || 'postgres',
    database: process.env.PGDATABASE || process.env.SQL_DB_NAME || 'postgres',
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: true } : false,
  };
};

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  schemaFilter: ['public'],
  dbCredentials: getDatabaseConfig() as any,
  migrations: {
    table: 'drizzle_migrations',
    schema: 'public',
  },
  verbose: true,
  strict: true,
});
