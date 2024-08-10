import { Either, right } from '@/core/either';
import { QuestionComment } from '../../enterprise/entities/question-comment';
import { IQuestionCommentsRepository } from '../repositories/question-comments';

type ListQuestionCommentsUseCaseParams = {
  questionId: string;
  page: number;
};

type ListQuestionCommentsUseCaseReturn = Either<
  null,
  {
    questionComments: QuestionComment[];
  }
>;

export class ListQuestionCommentsUseCase {
  constructor(
    private questionCommentsRepository: IQuestionCommentsRepository,
  ) {}

  async execute({
    questionId,
    page,
  }: ListQuestionCommentsUseCaseParams): Promise<ListQuestionCommentsUseCaseReturn> {
    const questionComments =
      await this.questionCommentsRepository.findManyByQuestionId(questionId, {
        page,
      });

    return right({
      questionComments,
    });
  }
}
