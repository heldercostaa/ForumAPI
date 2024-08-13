import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { hash } from 'bcryptjs';
import request from 'supertest';

import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { StudentFactory } from 'test/factories/make-student';

describe('Authenticate (E2E', () => {
  let app: INestApplication;
  let studentFactory: StudentFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    studentFactory = moduleRef.get(StudentFactory);

    await app.init();
  });

  test('[POST] /sessions', async () => {
    await studentFactory.makePrismaStudent({
      email: 'john@acme.com',
      password: await hash('123456', 8),
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
