import { Injectable } from '@nestjs/common';

import { Either, left, right } from '@/core/either';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { IAnswersRepository } from '../repositories/answers';

type DeleteAnswerUseCaseParams = {
  authorId: string;
  answerId: string;
};

type DeleteAnswerUseCaseReturn = Either<
  ResourceNotFoundError | NotAllowedError,
  null
>;

@Injectable()
export class DeleteAnswerUseCase {
  constructor(private answersRepository: IAnswersRepository) {}

  async execute({
    answerId,
    authorId,
  }: DeleteAnswerUseCaseParams): Promise<DeleteAnswerUseCaseReturn> {
    const answer = await this.answersRepository.findById(answerId);

    if (!answer) {
      return left(new ResourceNotFoundError());
    }

    if (authorId !== answer.authorId.toString()) {
      return left(new NotAllowedError());
    }

    await this.answersRepository.delete(answer);

    return right(null);
  }
}
