import { Either, right } from '@/core/either';
import { Answer } from '../../enterprise/entities/answer';
import { IAnswersRepository } from '../repositories/answers';

type ListQuestionAnswersUseCaseRequest = {
  questionId: string;
  page: number;
};

type ListQuestionAnswersUseCaseResponse = Either<
  null,
  {
    answers: Answer[];
  }
>;

export class ListQuestionAnswersUseCase {
  constructor(private answersRepository: IAnswersRepository) {}

  async execute({
    questionId,
    page,
  }: ListQuestionAnswersUseCaseRequest): Promise<ListQuestionAnswersUseCaseResponse> {
    const answers = await this.answersRepository.findManyByQuestionId(
      questionId,
      { page },
    );

    return right({
      answers,
    });
  }
}
