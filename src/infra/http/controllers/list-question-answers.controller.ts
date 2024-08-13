import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Query,
} from '@nestjs/common';
import z from 'zod';

import { ListQuestionAnswersUseCase } from '@/domain/forum/application/use-cases/list-question-answers';
import { ZodValidationPipe } from '../pipes/zod-validation.pipe';
import { AnswerPresenter } from '../presenters/answer';

const QuerySchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1));

type Query = z.infer<typeof QuerySchema>;

const QueryValidationPipe = new ZodValidationPipe(QuerySchema);

@Controller('/questions/:questionId/answers')
export class ListQuestionAnswersController {
  constructor(private listQuestionAnswers: ListQuestionAnswersUseCase) {}

  @Get()
  async handle(
    @Query('page', QueryValidationPipe) page: Query,
    @Param('questionId') questionId: string,
  ) {
    const result = await this.listQuestionAnswers.execute({ questionId, page });

    if (result.isLeft()) {
      throw new BadRequestException();
    }

    const answers = result.value.answers;

    return { answers: answers.map(AnswerPresenter.toHTTP) };
  }
}
