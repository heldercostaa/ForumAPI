import { Env } from '@/infra/env/env';
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(config: ConfigService<Env, true>) {
    const logLevels: Array<'query' | 'info' | 'warn' | 'error'> = [
      'warn',
      'error',
    ];

    const DB_QUERY_LOG = config.get('DB_QUERY_LOG', { infer: true });
    if (DB_QUERY_LOG === true) {
      logLevels.push('query');
    }

    super({ log: logLevels });
  }

  onModuleInit() {
    return this.$connect();
  }

  onModuleDestroy() {
    return this.$disconnect();
  }
}
