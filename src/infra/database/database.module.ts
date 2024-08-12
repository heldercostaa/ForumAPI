import { Module } from '@nestjs/common';

import { IQuestionsRepository } from '@/domain/forum/application/repositories/questions';
import { IStudentsRepository } from '@/domain/forum/application/repositories/students';
import { PrismaService } from './prisma/prisma.service';
import { PrismaAnswerAttachmentsRepository } from './prisma/repositories/answer-attachments';
import { PrismaAnswerCommentsRepository } from './prisma/repositories/answer-comments';
import { PrismaAnswersRepository } from './prisma/repositories/answers';
import { PrismaQuestionAttachmentsRepository } from './prisma/repositories/question-attachments';
import { PrismaQuestionCommentsRepository } from './prisma/repositories/question-comments';
import { PrismaQuestionsRepository } from './prisma/repositories/questions';
import { PrismaStudentsRepository } from './prisma/repositories/students';

@Module({
  providers: [
    PrismaService,
    PrismaAnswersRepository,
    { provide: IQuestionsRepository, useClass: PrismaQuestionsRepository },
    { provide: IStudentsRepository, useClass: PrismaStudentsRepository },
    PrismaAnswerCommentsRepository,
    PrismaQuestionCommentsRepository,
    PrismaAnswerAttachmentsRepository,
    PrismaQuestionAttachmentsRepository,
  ],
  exports: [
    PrismaService,
    PrismaAnswersRepository,
    IQuestionsRepository,
    IStudentsRepository,
    PrismaAnswerCommentsRepository,
    PrismaQuestionCommentsRepository,
    PrismaAnswerAttachmentsRepository,
    PrismaQuestionAttachmentsRepository,
  ],
})
export class DatabaseModule {}
