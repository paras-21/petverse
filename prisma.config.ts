// Prisma 7 reads its datasource URL from here, not from schema.prisma.
// The CLI (migrate, db pull) uses the session-mode pooler; the app uses DATABASE_URL at runtime (src/lib/db.ts).
import { defineConfig, env } from 'prisma/config';

try {
  process.loadEnvFile('.env');
} catch {
  // no .env file: rely on the real environment (CI, hosting)
}

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: { path: 'prisma/migrations' },
  datasource: { url: env('DIRECT_URL') },
});
