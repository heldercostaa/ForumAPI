import { AppModule } from '@/infra/app.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';

describe('Create question (E2E)', () => {
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

  test('[POST] /questions', async () => {
    const user = await prisma.user.create({
      data: {
        name: 'John Doe',
        email: 'john@acme.com',
        password: '123456',
      },
    });

    const accessToken = jwt.sign({ sub: user.id });

    const { body } = await request(app.getHttpServer())
      .post('/questions')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        title: 'What is question?',
        content: 'I want to know what a question is.',
      })
      .expect(({ body }) => expect(body.error).toBeUndefined())
      .expect(201);

    expect(body.question.id).toEqual(expect.any(String));
    expect(body.question.authorId).toEqual(user.id);
    expect(body.question.title).toEqual('What is question?');
    expect(body.question.content).toEqual('I want to know what a question is.');
    expect(body.question.slug).toEqual('what-is-question');

    const createdQuestion = await prisma.question.findFirst({
      where: { title: 'What is question?' },
    });

    expect(createdQuestion).toBeTruthy();
  });
});