#!/usr/bin/env node
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import pg from 'pg';
import { config } from 'dotenv';

config(); // load .env

const { Pool } = pg;
const __dir = dirname(fileURLToPath(import.meta.url));

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

try {
  console.log('🔄 Running init migration...');
  const sql = readFileSync(join(__dir, 'init.sql'), 'utf8');
  await pool.query(sql);

  console.log('🔄 Running v2 migration...');
  const sqlV2 = readFileSync(join(__dir, 'migrate-v2.sql'), 'utf8');
  await pool.query(sqlV2);

  console.log('🔄 Running v3 migration...');
  const sqlV3 = readFileSync(join(__dir, 'migrate-v3.sql'), 'utf8');
  await pool.query(sqlV3);

  console.log('🔄 Running v4 migration...');
  const sqlV4 = readFileSync(join(__dir, 'migrate-v4.sql'), 'utf8');
  await pool.query(sqlV4);

  console.log('✅ Migration complete.');
} catch (err) {
  console.error('❌ Migration failed:', err.message);
  process.exit(1);
} finally {
  await pool.end();
}
