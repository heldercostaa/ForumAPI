import { Injectable } from '@nestjs/common';

import { Either, right } from '@/core/either';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Answer } from '../../enterprise/entities/answer';
import { AnswerAttachment } from '../../enterprise/entities/answer-attachment';
import { AnswerAttachmentList } from '../../enterprise/entities/answer-attachment-list';
import { IAnswersRepository } from '../repositories/answers';

type AnswerQuestionUseCaseParams = {
  authorId: string;
  questionId: string;
  attachmentsIds: string[];
  content: string;
};

type AnswerQuestionUseCaseReturn = Either<
  null,
  {
    answer: Answer;
  }
>;

@Injectable()
export class AnswerQuestionUseCase {
  constructor(private answersRepository: IAnswersRepository) {}

  async execute({
    authorId,
    questionId,
    content,
    attachmentsIds,
  }: AnswerQuestionUseCaseParams): Promise<AnswerQuestionUseCaseReturn> {
    const answer = Answer.create({
      content,
      authorId: new UniqueEntityID(authorId),
      questionId: new UniqueEntityID(questionId),
    });

    const answerAttachment = attachmentsIds.map((attachmentId) => {
      return AnswerAttachment.create({
        attachmentId: new UniqueEntityID(attachmentId),
        answerId: answer.id,
      });
    });

    answer.attachments = new AnswerAttachmentList(answerAttachment);

    await this.answersRepository.create(answer);

    return right({ answer });
  }
}
