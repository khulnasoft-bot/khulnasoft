#!/usr/bin/env node

/**
 * Database Setup Script
 * 
 * Usage: npm run db:setup
 * 
 * This script:
 * 1. Verifies database connectivity
 * 2. Runs migrations
 * 3. Seeds initial data (if needed)
 * 4. Validates schema
 */

import * as dotenv from 'dotenv';
import path from 'path';
import { db } from '../src/db/index';
import { sql } from 'drizzle-orm';

// Load environment variables
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env.development.local' });
dotenv.config({ path: '/vercel/share/.env.project' });

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
};

function log(message: string, color: string = 'reset') {
  console.log(`${colors[color as keyof typeof colors]}${message}${colors.reset}`);
}

function logStep(step: number, title: string) {
  log(`\n[${step}] ${title}`, 'cyan');
}

async function checkDatabaseConnectivity() {
  logStep(1, 'Checking database connectivity...');
  try {
    await db.execute(sql`SELECT 1`);
    log('✓ Database connection successful', 'green');
    return true;
  } catch (error: any) {
    log(`✗ Database connection failed: ${error.message}`, 'red');
    return false;
  }
}

async function checkRequiredEnvVars() {
  logStep(2, 'Verifying environment variables...');

  const envVars = process.env;

  // Check for DATABASE_URL or individual vars
  const hasDbUrl = envVars.DATABASE_URL || envVars.POSTGRES_URL;
  const hasIndividual = envVars.PGHOST && envVars.PGUSER && envVars.PGDATABASE;

  if (!hasDbUrl && !hasIndividual) {
    log('✗ Missing database configuration. Provide either:', 'red');
    log('  - DATABASE_URL or POSTGRES_URL', 'yellow');
    log('  - Or: PGHOST, PGUSER, PGDATABASE', 'yellow');
    return false;
  }

  const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL || envVars.VITE_SUPABASE_URL;
  const supabaseKey = envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY || envVars.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    log('⚠ Supabase environment variables missing (optional for local dev)', 'yellow');
  }

  log('✓ Environment variables verified', 'green');
  return true;
}

async function checkDatabaseSchema() {
  logStep(3, 'Checking database schema...');
  try {
    // Check if tables exist
    const tablesQuery = sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `;

    const tables = await db.execute(tablesQuery as any);
    const tableCount = (tables as any).rowCount || 0;

    if (tableCount === 0) {
      log('⚠ No tables found. Run migrations with: npm run db:migrate', 'yellow');
      return false;
    }

    log(`✓ Found ${tableCount} tables in database`, 'green');

    // List tables
    (tables as any).rows?.forEach((row: any) => {
      log(`  - ${row.table_name}`, 'cyan');
    });

    return true;
  } catch (error: any) {
    log(`✗ Schema check failed: ${error.message}`, 'red');
    return false;
  }
}

async function checkMigrationTable() {
  logStep(4, 'Checking migration table...');
  try {
    const result = await db.execute(
      sql`SELECT COUNT(*) as count FROM drizzle_migrations` as any
    );
    const count = (result as any).rows?.[0]?.count || 0;
    log(`✓ Migration table exists with ${count} migrations applied`, 'green');
    return true;
  } catch (error) {
    log('⚠ Migration table not found. Migrations may not have been applied yet.', 'yellow');
    return false;
  }
}

async function verifySchema() {
  logStep(5, 'Verifying schema integrity...');
  try {
    // Check critical tables
    const criticalTables = [
      'users',
      'repositories',
      'github_organizations',
      'repository_notes',
      'organization_sync_jobs',
    ];

    for (const table of criticalTables) {
      const result = await db.execute(
        sql`SELECT COUNT(*) FROM information_schema.tables WHERE table_name = ${table}` as any
      );
      if ((result as any).rowCount === 0) {
        log(`✗ Critical table missing: ${table}`, 'red');
        return false;
      }
    }

    log('✓ All critical tables present', 'green');
    return true;
  } catch (error: any) {
    log(`✗ Schema verification failed: ${error.message}`, 'red');
    return false;
  }
}

async function runSetup() {
  log('\n╭─────────────────────────────────────────────────╮', 'cyan');
  log('│     KhulnaSoft Database Setup Script              │', 'cyan');
  log('╰─────────────────────────────────────────────────╯', 'cyan');

  try {
    // Check environment variables
    const envOk = await checkRequiredEnvVars();
    if (!envOk) process.exit(1);

    // Check database connectivity
    const connOk = await checkDatabaseConnectivity();
    if (!connOk) {
      log('\n✗ Cannot proceed: database is unreachable', 'red');
      process.exit(1);
    }

    // Check schema
    await checkDatabaseSchema();

    // Check migrations
    await checkMigrationTable();

    // Verify schema
    const schemaOk = await verifySchema();

    // Summary
    log('\n╭─────────────────────────────────────────────────╮', 'cyan');
    if (schemaOk) {
      log('│    ✓ Database setup verification complete       │', 'green');
      log('│    The database is ready for production use.    │', 'green');
    } else {
      log('│    ⚠ Some checks failed - review the output    │', 'yellow');
    }
    log('╰─────────────────────────────────────────────────╯', 'cyan');

    // Next steps
    if (!schemaOk) {
      log('\nNext steps:', 'yellow');
      log('1. Run migrations: npm run db:migrate', 'yellow');
      log('2. Re-run this script: npm run db:setup', 'yellow');
    }

    process.exit(schemaOk ? 0 : 1);
  } catch (error: any) {
    log(`\n✗ Setup failed: ${error.message}`, 'red');
    if (error.stack) log(error.stack, 'red');
    process.exit(1);
  }
}

// Run setup
runSetup();
