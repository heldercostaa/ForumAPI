import { config } from 'dotenv';

import { PrismaClient } from '@prisma/client';
import { execSync } from 'node:child_process';
import { randomUUID } from 'node:crypto';

config({ path: '.env', override: true });
config({ path: '.env.test', override: true });

const prisma = new PrismaClient();

function generateUniqueDbURL(schemaId: string) {
  if (!process.env.DB_URL) {
    throw new Error('Please provide a DB_URL environment variable');
  }

  const url = new URL(process.env.DB_URL);
  url.searchParams.set('schema', schemaId);

  return url.toString();
}

const schemaId = randomUUID();

beforeAll(() => {
  const dbURL = generateUniqueDbURL(schemaId);
  process.env.DB_URL = dbURL;

  execSync('pnpm prisma migrate deploy');
});

afterAll(async () => {
  await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schemaId}" CASCADE`);
  await prisma.$disconnect();
});
