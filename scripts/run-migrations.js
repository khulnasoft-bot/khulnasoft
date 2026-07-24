import { readFile } from 'fs/promises';
import fs from 'fs/promises';
import { resolve } from 'path';
import pg from 'pg';

const { Pool } = pg;

async function runMigrations() {
    const migrationsDir = resolve(process.cwd(), 'db', 'migrations');
    const files = await fs.readdir(migrationsDir);
    const sqlFiles = files.filter((f) => f.endsWith('.sql')).sort();

    if (sqlFiles.length === 0) {
        console.log('No SQL migrations found in', migrationsDir);
        return;
    }

    const pool = new Pool({
        host: process.env.SQL_HOST || process.env.PGHOST || 'localhost',
        user: process.env.SQL_USER || process.env.PGUSER,
        password: process.env.SQL_PASSWORD || process.env.PGPASSWORD,
        database: process.env.SQL_DB_NAME || process.env.PGDATABASE,
        port: process.env.SQL_PORT ? Number(process.env.SQL_PORT) : undefined,
    });

    try {
        for (const file of sqlFiles) {
            const filePath = resolve(migrationsDir, file);
            console.log(`\n🔄 Applying migration: ${file}`);
            const sql = await fs.readFile(filePath, 'utf8');
            try {
                await pool.query(sql);
                console.log('✓ Applied:', file);
            } catch (err) {
                console.error('Failed to apply', file, err.message || err);
                throw err;
            }
        }

        console.log('\nAll migrations applied successfully');
    } finally {
        await pool.end();
    }
}

runMigrations().catch((err) => {
    console.error('Migration run failed:', err.message || err);
    process.exit(1);
});
