import { Either, right } from '@/core/either';
import { Question } from '../../enterprise/entities/question';
import { IQuestionsRepository } from '../repositories/questions';
import { Injectable } from '@nestjs/common';

type ListRecentQuestionsUseCaseParams = {
  page: number;
};

type ListRecentQuestionsUseCaseReturn = Either<
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
  }: ListRecentQuestionsUseCaseParams): Promise<ListRecentQuestionsUseCaseReturn> {
    const questions = await this.questionsRepository.findManyRecent({ page });

    return right({
      questions,
    });
  }
}
