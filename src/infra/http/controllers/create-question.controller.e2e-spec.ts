import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';

import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { StudentFactory } from 'test/factories/make-student';
import { AttachmentFactory } from 'test/factories/make-attachment';

describe('Create question (E2E)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwt: JwtService;
  let studentFactory: StudentFactory;
  let attachmentFactory: AttachmentFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, AttachmentFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get(PrismaService);
    jwt = moduleRef.get(JwtService);
    studentFactory = moduleRef.get(StudentFactory);
    attachmentFactory = moduleRef.get(AttachmentFactory);

    await app.init();
  });

  test('[POST] /questions', async () => {
    const user = await studentFactory.makePrismaStudent();
    const accessToken = jwt.sign({ sub: user.id.toString() });

    const attachment1 = await attachmentFactory.makePrismaAttachment();
    const attachment2 = await attachmentFactory.makePrismaAttachment();

    const { body } = await request(app.getHttpServer())
      .post('/questions')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        title: 'What is question?',
        content: 'I want to know what a question is.',
        attachments: [attachment1.id.toString(), attachment2.id.toString()],
      })
      .expect(({ body }) => expect(body.error).toBeUndefined())
      .expect(201);

    expect(body.question.id.toString()).toEqual(expect.any(String));
    expect(body.question.authorId).toEqual(user.id.toString());
    expect(body.question.title).toEqual('What is question?');
    expect(body.question.content).toEqual('I want to know what a question is.');
    expect(body.question.slug).toEqual('what-is-question');

    const createdQuestion = await prisma.question.findFirst({
      where: { title: 'What is question?' },
    });

    expect(createdQuestion).toBeTruthy();

    const createdAttachments = await prisma.attachment.findMany({
      where: { questionId: createdQuestion?.id },
    });

    expect(createdAttachments).toHaveLength(2);
  });
});
