import { Injectable } from '@nestjs/common';

import { Either, right } from '@/core/either';
import { CommentWithAuthor } from '../../enterprise/entities/value-objects/comment-with-author';
import { IQuestionCommentsRepository } from '../repositories/question-comments';

type ListQuestionCommentsUseCaseParams = {
  questionId: string;
  page: number;
};

type ListQuestionCommentsUseCaseReturn = Either<
  null,
  {
    comments: CommentWithAuthor[];
  }
>;

@Injectable()
export class ListQuestionCommentsUseCase {
  constructor(
    private questionCommentsRepository: IQuestionCommentsRepository,
  ) {}

  async execute({
    questionId,
    page,
  }: ListQuestionCommentsUseCaseParams): Promise<ListQuestionCommentsUseCaseReturn> {
    const comments =
      await this.questionCommentsRepository.findManyByQuestionIdWithAuthor(
        questionId,
        {
          page,
        },
      );

    return right({ comments });
  }
}
