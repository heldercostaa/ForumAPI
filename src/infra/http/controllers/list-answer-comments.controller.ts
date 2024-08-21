import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Query,
} from '@nestjs/common';
import z from 'zod';

import { ListAnswerCommentsUseCase } from '@/domain/forum/application/use-cases/list-answer-comments';
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

@Controller('/answers/:answerId/comments')
export class ListAnswerCommentsController {
  constructor(private listAnswerComments: ListAnswerCommentsUseCase) {}

  @Get()
  async handle(
    @Query('page', QueryValidationPipe) page: Query,
    @Param('answerId') answerId: string,
  ) {
    const result = await this.listAnswerComments.execute({
      answerId,
      page,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }

    const comments = result.value.comments;

    return { comments: comments.map(CommentWithAuthorPresenter.toHTTP) };
  }
}
