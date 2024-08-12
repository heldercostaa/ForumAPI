import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import z from 'zod';

import { ListRecentQuestionsUseCase } from '@/domain/forum/application/use-cases/list-recent-questions';
import { ZodValidationPipe } from '../pipes/zod-validation.pipe';
import { QuestionPresenter } from '../presenters/question';

const QuerySchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1));

type Query = z.infer<typeof QuerySchema>;

const QueryValidationPipe = new ZodValidationPipe(QuerySchema);

@Controller('/questions')
export class ListRecentQuestionsController {
  constructor(private listRecentQuestions: ListRecentQuestionsUseCase) {}

  @Get()
  async handle(@Query('page', QueryValidationPipe) page: Query) {
    const result = await this.listRecentQuestions.execute({ page });

    if (result.isLeft()) {
      throw new BadRequestException();
    }

    const questions = result.value.questions;

    return { questions: questions.map(QuestionPresenter.toHTTP) };
  }
}
