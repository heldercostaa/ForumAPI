import { IPaginationParams } from '@/core/repositories/pagination-params';
import { IQuestionCommentsRepository } from '@/domain/forum/application/repositories/question-comments';
import { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment';
import { InMemoryStudentsRepository } from './in-memory-students-repository';
import { CommentWithAuthor } from '@/domain/forum/enterprise/entities/value-objects/comment-with-author';

export class InMemoryQuestionCommentsRepository
  implements IQuestionCommentsRepository
{
  public items: QuestionComment[] = [];

  constructor(
    // private questionAttachmentsRepository: InMemoryQuestionAttachmentsRepository,
    // private attachmentsRepository: InMemoryAttachmentsRepository,
    private studentsRepository: InMemoryStudentsRepository,
  ) {}

  async findById(id: string) {
    const questionComment = this.items.find(
      (item) => item.id.toString() === id,
    );

    if (!questionComment) return null;

    return questionComment;
  }

  async findManyByQuestionId(questionId: string, { page }: IPaginationParams) {
    const questionComments = this.items
      .filter((item) => item.questionId.toString() === questionId)
      .slice((page - 1) * 20, page * 20);

    return questionComments;
  }

  async findManyByQuestionIdWithAuthor(
    questionId: string,
    { page }: IPaginationParams,
  ) {
    const questionComments = this.items
      .filter((item) => item.questionId.toString() === questionId)
      .slice((page - 1) * 20, page * 20)
      .map((comment) => {
        const author = this.studentsRepository.items.find((student) =>
          student.id.equals(comment.authorId),
        );

        if (!author) {
          throw new Error(
            `Author with ID [${comment.authorId.toString()}] does not exist in students repository`,
          );
        }

        return CommentWithAuthor.create({
          content: comment.content,
          commentId: comment.id,
          createdAt: comment.createdAt,
          updatedAt: comment.updatedAt,
          authorId: comment.authorId,
          author: author.name,
        });
      });

    return questionComments;
  }

  async create(questionComment: QuestionComment) {
    this.items.push(questionComment);
  }

  async delete(questionComment: QuestionComment) {
    const itemIndex = this.items.findIndex(
      (item) => item.id === questionComment.id,
    );

    this.items.splice(itemIndex, 1);
  }
}
