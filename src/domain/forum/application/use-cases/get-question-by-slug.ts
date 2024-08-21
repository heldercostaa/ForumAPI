import { Injectable } from '@nestjs/common';

import { Either, left, right } from '@/core/either';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { QuestionDetails } from '../../enterprise/entities/value-objects/question-details';
import { IQuestionsRepository } from '../repositories/questions';

type GetQuestionBySlugUseCaseParams = {
  slug: string;
};

type GetQuestionBySlugUseCaseReturn = Either<
  ResourceNotFoundError,
  {
    question: QuestionDetails;
  }
>;

@Injectable()
export class GetQuestionBySlugUseCase {
  constructor(private questionsRepository: IQuestionsRepository) {}

  async execute({
    slug,
  }: GetQuestionBySlugUseCaseParams): Promise<GetQuestionBySlugUseCaseReturn> {
    const question = await this.questionsRepository.findDetailsBySlug(slug);

    if (!question) {
      return left(new ResourceNotFoundError());
    }

    return right({ question });
  }
}
