import { AppModule } from '@/app.module';
import { PrismaService } from '@/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { hash } from 'bcryptjs';
import request from 'supertest';

describe('Create Account (E2E)', () => {
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

  test('[POST] /accounts', async () => {
    const { body } = await request(app.getHttpServer())
      .post('/accounts')
      .send({
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: '123456',
      })
      .expect(({ body }) => expect(body.error).toBeUndefined())
      .expect(201);

    expect(body.user.id).toEqual(expect.any(String));
    expect(body.user.name).toEqual('John Doe');
    expect(body.user.email).toEqual('johndoe@example.com');
    expect(body.user.password).toBeUndefined();

    const createdUser = await prisma.user.findUnique({
      where: { email: 'johndoe@example.com' },
    });

    expect(createdUser).toBeTruthy();
  });
});
