import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

import { IPaginationParams } from '@/core/repositories/pagination-params';
import { IAnswersRepository } from '@/domain/forum/application/repositories/answers';
import { Answer } from '@/domain/forum/enterprise/entities/answer';
import { PrismaAnswerMapper } from '../mappers/prisma-answer';

@Injectable()
export class PrismaAnswersRepository implements IAnswersRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<Answer | null> {
    const answer = await this.prisma.answer.findUnique({ where: { id } });

    if (!answer) {
      return null;
    }

    return PrismaAnswerMapper.toDomain(answer);
  }

  async findManyByQuestionId(
    questionId: string,
    { page }: IPaginationParams,
  ): Promise<Answer[]> {
    const answers = await this.prisma.answer.findMany({
      where: { questionId },
      orderBy: { createdAt: 'desc' },
      take: 20,
      skip: (page - 1) * 20,
    });

    return answers.map(PrismaAnswerMapper.toDomain);
  }

  async create(answer: Answer): Promise<void> {
    const data = PrismaAnswerMapper.toPrisma(answer);

    await this.prisma.answer.create({ data });
  }

  async save(answer: Answer): Promise<void> {
    const data = PrismaAnswerMapper.toPrisma(answer);

    await this.prisma.answer.update({ where: { id: data.id }, data });
  }

  async delete(answer: Answer): Promise<void> {
    const data = PrismaAnswerMapper.toPrisma(answer);

    await this.prisma.answer.delete({ where: { id: data.id } });
  }
}
