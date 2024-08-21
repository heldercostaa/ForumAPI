import { IPaginationParams } from '@/core/repositories/pagination-params';
import { AnswerComment } from '../../enterprise/entities/answer-comment';
import { CommentWithAuthor } from '../../enterprise/entities/value-objects/comment-with-author';

export abstract class IAnswerCommentsRepository {
  abstract findById(id: string): Promise<AnswerComment | null>;
  abstract findManyByAnswerId(
    answerId: string,
    params: IPaginationParams,
  ): Promise<AnswerComment[]>;
  abstract findManyByAnswerIdWithAuthor(
    questionId: string,
    params: IPaginationParams,
  ): Promise<CommentWithAuthor[]>;
  abstract create(answerComment: AnswerComment): Promise<void>;
  abstract delete(answerComment: AnswerComment): Promise<void>;
}
