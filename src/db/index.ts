import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import * as schema from './schema.ts';

const { Pool } = pg;

declare global {
  var _postgresPool: pg.Pool | undefined;
}

export const createPool = () => {
  if (!global._postgresPool) {
    const poolConfig = {
      connectionString: process.env.DATABASE_URL,
      host: process.env.SQL_HOST,
      user: process.env.SQL_USER,
      password: process.env.SQL_PASSWORD,
      database: process.env.SQL_DB_NAME,
      max: 10,
      connectionTimeoutMillis: 15000,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    };

    console.log('[DB] Connecting to database...');
    global._postgresPool = new Pool(poolConfig);

    global._postgresPool.on('connect', () => {
      console.log('Database pool connection established');
    });

    global._postgresPool.on('error', (err) => {
      console.error('Database pool error:', err);
    });
  }
  return global._postgresPool;
};

const pool = createPool();

export const db = drizzle(pool, { schema });

export async function checkDatabaseHealth() {
  try {
    await db.execute('SELECT 1');
    console.log('Database connection healthy');
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
}
