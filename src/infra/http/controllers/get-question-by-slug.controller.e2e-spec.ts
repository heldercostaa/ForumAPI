import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';

import { AppModule } from '@/infra/app.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';

describe('Get question by slug (E2E)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get(PrismaService);
    jwt = moduleRef.get(JwtService);

    await app.init();
  });

  test('[GET] /questions/:slug', async () => {
    const user = await prisma.user.create({
      data: {
        name: 'John Doe',
        email: 'john@acme.com',
        password: '123456',
      },
    });

    const accessToken = jwt.sign({ sub: user.id });

    await prisma.question.create({
      data: {
        authorId: user.id,
        title: 'Question 1',
        slug: 'question-1',
        content: 'Content 1',
      },
    });

    const { body } = await request(app.getHttpServer())
      .get(`/questions/question-1`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()
      .expect(({ body }) => expect(body.error).toBeUndefined())
      .expect(200);

    expect(body).toEqual({
      question: expect.objectContaining({ title: 'Question 1' }),
    });
  });
});
