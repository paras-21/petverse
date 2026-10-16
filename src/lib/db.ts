// Server-side only: never import this from a client component (it reads DATABASE_URL).
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@/generated/prisma/client';

// One client per server process. In dev, Next reloads modules on every edit, so the client is kept on globalThis
// to avoid opening a new pool each time. Runtime traffic goes through Supabase's transaction-mode pooler.
const globalForDb = globalThis as unknown as { prisma?: PrismaClient };

function createClient() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error('DATABASE_URL is not set');
  return new PrismaClient({ adapter: new PrismaPg({ connectionString: url }) });
}

export const db = globalForDb.prisma ?? createClient();
if (process.env.NODE_ENV !== 'production') globalForDb.prisma = db;
