import { IPaginationParams } from '@/core/repositories/pagination-params';
import { IAnswerCommentsRepository } from '@/domain/forum/application/repositories/answer-comments';
import { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment';

export class InMemoryAnswerCommentRepository
  implements IAnswerCommentsRepository
{
  public items: AnswerComment[] = [];

  async findById(id: string) {
    const answerComment = this.items.find((item) => item.id.toString() === id);

    if (!answerComment) return null;

    return answerComment;
  }

  async findManyByAnswerId(answerId: string, { page }: IPaginationParams) {
    const answerComments = this.items
      .filter((item) => item.answerId.toString() === answerId)
      .slice((page - 1) * 20, page * 20);

    return answerComments;
  }

  async create(answerComment: AnswerComment) {
    this.items.push(answerComment);
  }

  async delete(answerComment: AnswerComment) {
    const itemIndex = this.items.findIndex(
      (item) => item.id === answerComment.id,
    );

    this.items.splice(itemIndex, 1);
  }
}