import dotenv from 'dotenv';

dotenv.config();
dotenv.config({ path: '.env.development.local' });

const isDevelopment = process.env.NODE_ENV !== 'production';

if (!process.env.DATABASE_URL && process.env.PGHOST) {
  const user = process.env.PGUSER || process.env.USER || 'postgres';
  const password = process.env.PGPASSWORD || '';
  const host = process.env.PGHOST || 'localhost';
  const port = process.env.PGPORT || '5432';
  const db = process.env.PGDATABASE || 'khulnasoft';
  process.env.DATABASE_URL = `postgresql://${user}:${password}@${host}:${port}/${db}`;
}

if (!process.env.REDIS_HOST) process.env.REDIS_HOST = 'localhost';
if (!process.env.REDIS_PORT) process.env.REDIS_PORT = '6379';

const requiredEnvVars = [
  'DATABASE_URL',
  'REDIS_HOST',
  'REDIS_PORT',
];

const githubVars = isDevelopment 
  ? [] 
  : ['GITHUB_APP_ID', 'GITHUB_CLIENT_ID', 'GITHUB_CLIENT_SECRET'];

const allRequiredVars = [...requiredEnvVars, ...githubVars];

const missingVars = allRequiredVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error('\n❌ Missing required environment variables:');
  missingVars.forEach(v => console.error(`  - ${v}`));
  
  if (isDevelopment) {
    console.error('\nℹ️  For local development:');
    console.error('  1. Copy .env.example to .env.development.local');
    console.error('  2. Fill in at least: DATABASE_URL, REDIS_HOST, REDIS_PORT');
    console.error('  3. GitHub vars are optional in development');
    console.error('\nℹ️  Or use docker-compose to start PostgreSQL and Redis:');
    console.error('  docker-compose up -d');
  } else {
    console.error('\n❌ For production, all environment variables must be set');
  }
  
  process.exit(1);
}

console.log('✅ Environment variables validated\n');

export const config = {
  nodeEnv: (process.env.NODE_ENV || 'development') as 'development' | 'production' | 'test',
  port: Number(process.env.PORT || 3000),
  database: {
    url: process.env.DATABASE_URL!,
  },
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: Number(process.env.REDIS_PORT || 6379),
  },
  github: {
    appId: process.env.GITHUB_APP_ID || 'development-default',
    clientId: process.env.GITHUB_CLIENT_ID || 'development-default',
    clientSecret: process.env.GITHUB_CLIENT_SECRET || 'development-default',
    webhookSecret: process.env.GITHUB_WEBHOOK_SECRET || 'development-default',
  },
  supabase: {
    url: process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    anonKey: process.env.VITE_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  },
  gemini: {
    apiKey: process.env.GEMINI_API_KEY || undefined,
  },
  features: {
    aiAnalysis: process.env.ENABLE_AI_ANALYSIS !== 'false',
    debug: process.env.DEBUG_MODE === 'true',
  },
};
