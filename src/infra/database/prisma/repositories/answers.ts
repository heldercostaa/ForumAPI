import { IPaginationParams } from '@/core/repositories/pagination-params';
import { IAnswersRepository } from '@/domain/forum/application/repositories/answers';
import { Answer } from '@/domain/forum/enterprise/entities/answer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PrismaAnswersRepository implements IAnswersRepository {
  findById(id: string): Promise<Answer | null> {
    throw new Error('Method not implemented.');
  }

  findManyByQuestionId(
    questionId: string,
    params: IPaginationParams,
  ): Promise<Answer[]> {
    throw new Error('Method not implemented.');
  }

  create(answer: Answer): Promise<void> {
    throw new Error('Method not implemented.');
  }

  save(answer: Answer): Promise<void> {
    throw new Error('Method not implemented.');
  }
  delete(answer: Answer): Promise<void> {
    throw new Error('Method not implemented.');
  }
}