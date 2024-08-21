import { Injectable } from '@nestjs/common';

import { Either, right } from '@/core/either';
import { CommentWithAuthor } from '../../enterprise/entities/value-objects/comment-with-author';
import { IAnswerCommentsRepository } from '../repositories/answer-comments';

type ListAnswerCommentsUseCaseParams = {
  answerId: string;
  page: number;
};

type ListAnswerCommentsUseCaseReturn = Either<
  null,
  {
    comments: CommentWithAuthor[];
  }
>;

@Injectable()
export class ListAnswerCommentsUseCase {
  constructor(private answerCommentsRepository: IAnswerCommentsRepository) {}

  async execute({
    answerId,
    page,
  }: ListAnswerCommentsUseCaseParams): Promise<ListAnswerCommentsUseCaseReturn> {
    const comments =
      await this.answerCommentsRepository.findManyByAnswerIdWithAuthor(
        answerId,
        {
          page,
        },
      );

    return right({ comments });
  }
}
