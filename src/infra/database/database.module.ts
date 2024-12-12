import { Module } from '@nestjs/common';

import { IAnswerAttachmentsRepository } from '@/domain/forum/application/repositories/answer-attachments';
import { IAnswerCommentsRepository } from '@/domain/forum/application/repositories/answer-comments';
import { IAnswersRepository } from '@/domain/forum/application/repositories/answers';
import { IAttachmentsRepository } from '@/domain/forum/application/repositories/attachments';
import { IQuestionAttachmentsRepository } from '@/domain/forum/application/repositories/question-attachments';
import { IQuestionCommentsRepository } from '@/domain/forum/application/repositories/question-comments';
import { IQuestionsRepository } from '@/domain/forum/application/repositories/questions';
import { IStudentsRepository } from '@/domain/forum/application/repositories/students';
import { INotificationsRepository } from '@/domain/notification/application/repositories/notifications';
import { PrismaService } from './prisma/prisma.service';
import { PrismaAnswerAttachmentsRepository } from './prisma/repositories/answer-attachments';
import { PrismaAnswerCommentsRepository } from './prisma/repositories/answer-comments';
import { PrismaAnswersRepository } from './prisma/repositories/answers';
import { PrismaAttachmentsRepository } from './prisma/repositories/attachments';
import { PrismaNotificationsRepository } from './prisma/repositories/notifications';
import { PrismaQuestionAttachmentsRepository } from './prisma/repositories/question-attachments';
import { PrismaQuestionCommentsRepository } from './prisma/repositories/question-comments';
import { PrismaQuestionsRepository } from './prisma/repositories/questions';
import { PrismaStudentsRepository } from './prisma/repositories/students';
import { CacheModule } from '../cache/cache.module';

@Module({
  imports: [CacheModule],
  providers: [
    PrismaService,
    PrismaAnswersRepository,
    { provide: IAnswersRepository, useClass: PrismaAnswersRepository },
    { provide: IQuestionsRepository, useClass: PrismaQuestionsRepository },
    { provide: IStudentsRepository, useClass: PrismaStudentsRepository },
    {
      provide: IAnswerCommentsRepository,
      useClass: PrismaAnswerCommentsRepository,
    },
    {
      provide: IQuestionCommentsRepository,
      useClass: PrismaQuestionCommentsRepository,
    },
    {
      provide: IAnswerAttachmentsRepository,
      useClass: PrismaAnswerAttachmentsRepository,
    },
    {
      provide: IQuestionAttachmentsRepository,
      useClass: PrismaQuestionAttachmentsRepository,
    },
    {
      provide: IAttachmentsRepository,
      useClass: PrismaAttachmentsRepository,
    },
    {
      provide: INotificationsRepository,
      useClass: PrismaNotificationsRepository,
    },
  ],
  exports: [
    PrismaService,
    IAnswersRepository,
    IStudentsRepository,
    IQuestionsRepository,
    IAnswerCommentsRepository,
    IQuestionCommentsRepository,
    IAnswerAttachmentsRepository,
    IQuestionAttachmentsRepository,
    IAttachmentsRepository,
    INotificationsRepository,
  ],
})
export class DatabaseModule {}
