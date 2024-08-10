import { Either, right } from '@/core/either';
import { Question } from '../../enterprise/entities/question';
import { IQuestionsRepository } from '../repositories/questions';
import { Injectable } from '@nestjs/common';

type ListRecentQuestionsUseCaseRequest = {
  page: number;
};

type ListRecentQuestionsUseCaseResponse = Either<
  null,
  {
    questions: Question[];
  }
>;

@Injectable()
export class ListRecentQuestionsUseCase {
  constructor(private questionsRepository: IQuestionsRepository) {}

  async execute({
    page,
  }: ListRecentQuestionsUseCaseRequest): Promise<ListRecentQuestionsUseCaseResponse> {
    const questions = await this.questionsRepository.findManyRecent({ page });

    return right({
      questions,
    });
  }
}
