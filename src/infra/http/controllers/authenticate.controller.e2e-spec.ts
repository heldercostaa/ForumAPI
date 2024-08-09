import { AppModule } from '@/infra/app.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { hash } from 'bcryptjs';
import request from 'supertest';

describe('Authenticate (E2E', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get(PrismaService);

    await app.init();
  });

  test('[POST] /sessions', async () => {
    await prisma.user.create({
      data: {
        name: 'John Doe',
        email: 'john@acme.com',
        password: await hash('123456', 8),
      },
    });

    const { body } = await request(app.getHttpServer())
      .post('/sessions')
      .send({
        email: 'john@acme.com',
        password: '123456',
      })
      .expect(({ body }) => expect(body.error).toBeUndefined())
      .expect(201);

    expect(body.accessToken).toEqual(expect.any(String));
  });
});
