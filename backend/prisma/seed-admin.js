const { Client } = require('pg');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const { resolve } = require('path');
const { v4: uuidv4 } = require('uuid');

dotenv.config({ path: resolve(process.cwd(), '.env') });

async function main() {
  const seedEmail = process.env.ADMIN_SEED_EMAIL || 'admin@healthcare.com';
  const seedPassword = process.env.ADMIN_SEED_PASSWORD || 'Admin@123';
  const dbUrl = process.env.DATABASE_URL;

  if (!dbUrl) {
    console.error('DATABASE_URL is not defined in .env');
    process.exit(1);
  }

  console.log('Seeding super admin using pg direct connection...');
  console.log('Target Email:', seedEmail);

  const client = new Client({
    connectionString: dbUrl,
  });

  try {
    await client.connect();

    // Check if user exists
    const res = await client.query('SELECT id FROM "users" WHERE email = $1', [seedEmail]);
    if (res.rows.length > 0) {
      console.log(`Admin with email ${seedEmail} already exists. Skipping.`);
      return;
    }

    const hashedPassword = await bcrypt.hash(seedPassword, 10);
    const id = uuidv4();
    const now = new Date();

    await client.query(
      `INSERT INTO "users" (id, name, email, password_hash, role, email_verified, is_active, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [id, 'Super Admin', seedEmail, hashedPassword, 'SUPER_ADMIN', true, true, now, now]
    );

    console.log(`Super admin created with ID: ${id}`);
  } catch (err) {
    console.error('Error seeding admin:', err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();
