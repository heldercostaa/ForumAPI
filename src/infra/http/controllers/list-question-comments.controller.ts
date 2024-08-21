import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Query,
} from '@nestjs/common';
import z from 'zod';

import { ListQuestionCommentsUseCase } from '@/domain/forum/application/use-cases/list-question-comments';
import { ZodValidationPipe } from '../pipes/zod-validation.pipe';
import { CommentWithAuthorPresenter } from '../presenters/comment-with-author';

const QuerySchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1));

type Query = z.infer<typeof QuerySchema>;

const QueryValidationPipe = new ZodValidationPipe(QuerySchema);

@Controller('/questions/:questionId/comments')
export class ListQuestionCommentsController {
  constructor(private listQuestionComments: ListQuestionCommentsUseCase) {}

  @Get()
  async handle(
    @Query('page', QueryValidationPipe) page: Query,
    @Param('questionId') questionId: string,
  ) {
    const result = await this.listQuestionComments.execute({
      page,
      questionId,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }

    const comments = result.value.comments;

    return { comments: comments.map(CommentWithAuthorPresenter.toHTTP) };
  }
}
