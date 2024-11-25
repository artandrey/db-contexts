import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './migrations/drizzle',
  schema: './src/core/infrastructure/persistence/drizzle/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
