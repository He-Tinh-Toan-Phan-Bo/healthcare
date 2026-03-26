// Prisma v7 config file (required for Prisma CLI).
// Stores datasource URL and migration paths outside schema.prisma.
import 'dotenv/config';
import { defineConfig } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'ts-node prisma/seed.ts',
  },




  datasource: {
    url: process.env['DATABASE_URL'],
  },
});

