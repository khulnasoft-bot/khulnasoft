import dotenv from 'dotenv';

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
  console.error('Missing required environment variables:');
  missingVars.forEach(v => console.error(`  - ${v}`));
  console.error('\nCopy .env.example to .env and fill in the values');
  process.exit(1);
}

console.log('Environment variables validated');

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
