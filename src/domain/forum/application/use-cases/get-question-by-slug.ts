import { Either, left, right } from '@/core/either';
import { Question } from '../../enterprise/entities/question';
import { IQuestionsRepository } from '../repositories/questions';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';

type GetQuestionBySlugUseCaseParams = {
  slug: string;
};

type GetQuestionBySlugUseCaseReturn = Either<
  ResourceNotFoundError,
  {
    question: Question;
  }
>;

export class GetQuestionBySlugUseCase {
  constructor(private questionsRepository: IQuestionsRepository) {}

  async execute({
    slug,
  }: GetQuestionBySlugUseCaseParams): Promise<GetQuestionBySlugUseCaseReturn> {
    const question = await this.questionsRepository.findBySlug(slug);

    if (!question) {
      return left(new ResourceNotFoundError());
    }

    return right({
      question,
    });
  }
}