import { config } from 'dotenv';
import { z } from 'zod';

if (process.env.NODE_ENV === 'test') {
  config({ path: '.env.test' });
} else {
  config();
}

export const envSchema = z.object({
  TZ: z.string().default('UTC'),

  NODE_ENV: z.enum(['development', 'test', 'production']).default('production'),
  PORT: z.coerce.number().default(3333),
  API_BASE_URL: z.string().url(),
  LOG_LEVEL: z
    .enum(['silent', 'trace', 'debug', 'info', 'warn', 'error', 'fatal'])
    .default('info'),

  JWT_PRIVATE_KEY: z.string(),
  JWT_PUBLIC_KEY: z.string(),

  DB_URL: z.string().url(),
  DB_QUERY_LOG: z
    .enum(['true', 'false'])
    .default('false')
    .transform((value) => value === 'true'),

  CLOUDFLARE_ACCOUNT_ID: z.string(),

  AWS_BUCKET_NAME: z.string(),
  AWS_ACCESS_KEY_ID: z.string(),
  AWS_SECRET_KEY_ID: z.string(),

  REDIS_HOST: z.string().optional().default('127.0.0.1'),
  REDIS_PORT: z.coerce.number().optional().default(6379),
  REDIS_DB: z.coerce.number().optional().default(0),
});

export type Env = z.infer<typeof envSchema>;
