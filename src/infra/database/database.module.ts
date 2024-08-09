import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { PrismaAnswersRepository } from './prisma/repositories/answers';
import { PrismaQuestionsRepository } from './prisma/repositories/questions';
import { PrismaAnswerCommentsRepository } from './prisma/repositories/answer-comments';
import { PrismaQuestionCommentsRepository } from './prisma/repositories/question-comments';
import { PrismaAnswerAttachmentsRepository } from './prisma/repositories/answer-attachments';
import { PrismaQuestionAttachmentsRepository } from './prisma/repositories/question-attachments';
import { IQuestionsRepository } from '@/domain/forum/application/repositories/questions';

@Module({
  providers: [
    PrismaService,
    PrismaAnswersRepository,
    {
      provide: IQuestionsRepository,
      useClass: PrismaQuestionsRepository,
    },
    PrismaAnswerCommentsRepository,
    PrismaQuestionCommentsRepository,
    PrismaAnswerAttachmentsRepository,
    PrismaQuestionAttachmentsRepository,
  ],
  exports: [
    PrismaService,
    PrismaAnswersRepository,
    IQuestionsRepository,
    PrismaAnswerCommentsRepository,
    PrismaQuestionCommentsRepository,
    PrismaAnswerAttachmentsRepository,
    PrismaQuestionAttachmentsRepository,
  ],
})
export class DatabaseModule {}
