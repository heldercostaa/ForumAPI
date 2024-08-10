import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { makeQuestionComment } from 'test/factories/make-question-comment';
import { InMemoryQuestionCommentRepository } from 'test/repositories/in-memory-question-comments';
import { ListQuestionCommentsUseCase } from './list-question-comments';

let inMemoryQuestionCommentRepository: InMemoryQuestionCommentRepository;
let sut: ListQuestionCommentsUseCase;

describe('List Question Questions', () => {
  beforeEach(() => {
    inMemoryQuestionCommentRepository = new InMemoryQuestionCommentRepository();
    sut = new ListQuestionCommentsUseCase(inMemoryQuestionCommentRepository);
  });

  it('should be able to list question questions', async () => {
    await inMemoryQuestionCommentRepository.create(
      makeQuestionComment({
        questionId: new UniqueEntityID('question-1'),
      }),
    );
    await inMemoryQuestionCommentRepository.create(
      makeQuestionComment({
        questionId: new UniqueEntityID('question-1'),
      }),
    );
    await inMemoryQuestionCommentRepository.create(
      makeQuestionComment({
        questionId: new UniqueEntityID('question-1'),
      }),
    );
    await inMemoryQuestionCommentRepository.create(
      makeQuestionComment({
        questionId: new UniqueEntityID('question-2'),
      }),
    );

    const result = await sut.execute({
      questionId: 'question-1',
      page: 1,
    });

    expect(result.value?.questionComments).toHaveLength(3);
  });

  it('should be able to list paginated question questions', async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemoryQuestionCommentRepository.create(
        makeQuestionComment({
          questionId: new UniqueEntityID('question-1'),
        }),
      );
    }

    const result = await sut.execute({
      questionId: 'question-1',
      page: 2,
    });

    expect(result.value?.questionComments).toHaveLength(2);
  });
});
