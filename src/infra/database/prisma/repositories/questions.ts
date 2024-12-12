import { Injectable } from '@nestjs/common';

import { IPaginationParams } from '@/core/repositories/pagination-params';
import { IQuestionAttachmentsRepository } from '@/domain/forum/application/repositories/question-attachments';
import { IQuestionsRepository } from '@/domain/forum/application/repositories/questions';
import { Question } from '@/domain/forum/enterprise/entities/question';
import { QuestionDetails } from '@/domain/forum/enterprise/entities/value-objects/question-details';
import { PrismaQuestionMapper } from '../mappers/prisma-question';
import { PrismaQuestionDetailsMapper } from '../mappers/prisma-question-details';
import { PrismaService } from '../prisma.service';
import { DomainEvents } from '@/core/events/domain-events';

@Injectable()
export class PrismaQuestionsRepository implements IQuestionsRepository {
  constructor(
    private prisma: PrismaService,
    // private cache: CacheRepository,
    private questionAttachmentsRepository: IQuestionAttachmentsRepository,
  ) {}

  async findById(id: string): Promise<Question | null> {
    const question = await this.prisma.question.findUnique({ where: { id } });

    if (!question) {
      return null;
    }

    return PrismaQuestionMapper.toDomain(question);
  }

  async findBySlug(slug: string): Promise<Question | null> {
    const question = await this.prisma.question.findUnique({ where: { slug } });

    if (!question) {
      return null;
    }

    return PrismaQuestionMapper.toDomain(question);
  }

  async findDetailsBySlug(slug: string): Promise<QuestionDetails | null> {
    // const cacheHit = await this.cache.get(`question:${slug}:details`)

    // if (cacheHit) {
    //   const cacheData = JSON.parse(cacheHit)

    //   return cacheData
    // }

    const question = await this.prisma.question.findUnique({
      where: {
        slug,
      },
      include: {
        author: true,
        attachments: true,
      },
    });

    if (!question) {
      return null;
    }

    const questionDetails = PrismaQuestionDetailsMapper.toDomain(question);

    // await this.cache.set(
    //   `question:${slug}:details`,
    //   JSON.stringify(questionDetails),
    // );

    return questionDetails;
  }

  async findManyRecent({ page }: IPaginationParams): Promise<Question[]> {
    const questions = await this.prisma.question.findMany({
      orderBy: { createdAt: 'desc' },
      take: 20,
      skip: (page - 1) * 20,
    });

    return questions.map(PrismaQuestionMapper.toDomain);
  }

  async create(question: Question): Promise<void> {
    const data = PrismaQuestionMapper.toPrisma(question);

    await this.prisma.question.create({ data });

    await this.questionAttachmentsRepository.createMany(
      question.attachments.getItems(),
    );

    DomainEvents.dispatchEventsForAggregate(question.id);
  }

  async save(question: Question): Promise<void> {
    const data = PrismaQuestionMapper.toPrisma(question);

    await Promise.all([
      await this.prisma.question.update({ where: { id: data.id }, data }),
      await this.questionAttachmentsRepository.createMany(
        question.attachments.getNewItems(),
      ),
      await this.questionAttachmentsRepository.deleteMany(
        question.attachments.getRemovedItems(),
      ),
    ]);

    DomainEvents.dispatchEventsForAggregate(question.id);
  }

  async delete(question: Question): Promise<void> {
    const data = PrismaQuestionMapper.toPrisma(question);

    await this.prisma.question.delete({ where: { id: data.id } });
  }
}
