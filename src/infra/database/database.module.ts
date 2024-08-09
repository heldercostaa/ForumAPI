import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { PrismaAnswersRepository } from './prisma/repositories/answers-repository';
import { PrismaQuestionsRepository } from './prisma/repositories/questions-repository';
import { PrismaAnswerCommentsRepository } from './prisma/repositories/answer-comments-repository';
import { PrismaQuestionCommentsRepository } from './prisma/repositories/question-comments-repository';
import { PrismaAnswerAttachmentsRepository } from './prisma/repositories/answer-attachments-repository';
import { PrismaQuestionAttachmentsRepository } from './prisma/repositories/question-attachments.repository';

@Module({
  providers: [
    PrismaService,
    PrismaAnswersRepository,
    PrismaQuestionsRepository,
    PrismaAnswerCommentsRepository,
    PrismaQuestionCommentsRepository,
    PrismaAnswerAttachmentsRepository,
    PrismaQuestionAttachmentsRepository,
  ],
  exports: [
    PrismaService,
    PrismaAnswersRepository,
    PrismaQuestionsRepository,
    PrismaAnswerCommentsRepository,
    PrismaQuestionCommentsRepository,
    PrismaAnswerAttachmentsRepository,
    PrismaQuestionAttachmentsRepository,
  ],
})
export class DatabaseModule {}
