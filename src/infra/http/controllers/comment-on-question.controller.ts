import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Param,
  Post,
} from '@nestjs/common';
import z from 'zod';

import { CommentOnQuestionUseCase } from '@/domain/forum/application/use-cases/comment-on-question';
import { CurrentUser } from '@/infra/auth/current-user.decorator';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import { ZodValidationPipe } from '../pipes/zod-validation.pipe';

const BodySchema = z.object({
  content: z.string(),
});

type Body = z.infer<typeof BodySchema>;

const BodyValidationPipe = new ZodValidationPipe(BodySchema);

@Controller('/questions/:questionId/comments')
export class CommentOnQuestionController {
  constructor(private commentOnQuestion: CommentOnQuestionUseCase) {}

  @Post()
  @HttpCode(201)
  async handle(
    @CurrentUser() user: UserPayload,
    @Body(BodyValidationPipe) body: Body,
    @Param('questionId') questionId: string,
  ) {
    const userId = user.sub;
    const { content } = body;

    const result = await this.commentOnQuestion.execute({
      questionId,
      content,
      authorId: userId,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
