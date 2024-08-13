import { Injectable } from '@nestjs/common';

import { Either, right } from '@/core/either';
import { Answer } from '../../enterprise/entities/answer';
import { IAnswersRepository } from '../repositories/answers';

type ListQuestionAnswersUseCaseParams = {
  questionId: string;
  page: number;
};

type ListQuestionAnswersUseCaseReturn = Either<
  null,
  {
    answers: Answer[];
  }
>;

@Injectable()
export class ListQuestionAnswersUseCase {
  constructor(private answersRepository: IAnswersRepository) {}

  async execute({
    questionId,
    page,
  }: ListQuestionAnswersUseCaseParams): Promise<ListQuestionAnswersUseCaseReturn> {
    const answers = await this.answersRepository.findManyByQuestionId(
      questionId,
      { page },
    );

    return right({
      answers,
    });
  }
}
