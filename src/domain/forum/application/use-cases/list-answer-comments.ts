import { Either, right } from '@/core/either';
import { AnswerComment } from '../../enterprise/entities/answer-comment';
import { IAnswerCommentsRepository } from '../repositories/answer-comments';

type ListAnswerCommentsUseCaseParams = {
  answerId: string;
  page: number;
};

type ListAnswerCommentsUseCaseReturn = Either<
  null,
  {
    answerComments: AnswerComment[];
  }
>;

export class ListAnswerCommentsUseCase {
  constructor(private answerCommentsRepository: IAnswerCommentsRepository) {}

  async execute({
    answerId,
    page,
  }: ListAnswerCommentsUseCaseParams): Promise<ListAnswerCommentsUseCaseReturn> {
    const answerComments =
      await this.answerCommentsRepository.findManyByAnswerId(answerId, {
        page,
      });

    return right({
      answerComments,
    });
  }
}
