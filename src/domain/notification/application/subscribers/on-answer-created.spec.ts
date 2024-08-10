import { makeAnswer } from 'test/factories/make-answer';
import { makeQuestion } from 'test/factories/make-question';
import { InMemoryAnswerAttachmentRepository } from 'test/repositories/in-memory-answer-attachments';
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers';
import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications';
import { InMemoryQuestionAttachmentRepository } from 'test/repositories/in-memory-question-attachments';
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions';
import { waitFor } from 'test/utils/wait-for';
import { MockInstance } from 'vitest';
import { SendNotificationUseCase } from '../use-cases/send-notification';
import { OnAnswerCreated } from './on-answer-created';

let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentRepository;
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentRepository;
let inMemoryAnswersRepository: InMemoryAnswersRepository;
let inMemoryNotificationsRepository: InMemoryNotificationsRepository;
let sendNotificationUseCase: SendNotificationUseCase;

let sendNotificationExecuteSpy: MockInstance<
  SendNotificationUseCase['execute']
>;

describe('On Answer Created', () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentRepository();
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
    );
    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentRepository();
    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentsRepository,
    );

    inMemoryNotificationsRepository = new InMemoryNotificationsRepository();
    sendNotificationUseCase = new SendNotificationUseCase(
      inMemoryNotificationsRepository,
    );

    sendNotificationExecuteSpy = vi.spyOn(sendNotificationUseCase, 'execute');

    new OnAnswerCreated(inMemoryQuestionsRepository, sendNotificationUseCase);
  });

  it('should send a notification when an answer is created', async () => {
    const question = makeQuestion();
    const answer = makeAnswer({ questionId: question.id });

    inMemoryQuestionsRepository.create(question);
    inMemoryAnswersRepository.create(answer);

    await waitFor(() => {
      expect(sendNotificationExecuteSpy).toHaveBeenCalled();
    });
  });
});