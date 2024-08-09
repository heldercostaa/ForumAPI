import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Env } from './env';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // logger: false,
  });

  const config = app.get<ConfigService<Env, true>>(ConfigService);

  const PORT = config.get('PORT', { infer: true });
  await app.listen(PORT);
}

bootstrap();
