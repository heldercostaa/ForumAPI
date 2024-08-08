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

  DB_URL: z.string().url(),
  DB_QUERY_LOG: z
    .enum(['true', 'false'])
    .default('false')
    .transform((value) => value === 'true'),
});

export type Env = z.infer<typeof envSchema>;
