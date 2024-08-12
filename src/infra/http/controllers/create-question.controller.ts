import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
} from '@nestjs/common';
import z from 'zod';

import { CreateQuestionUseCase } from '@/domain/forum/application/use-cases/create-question';
import { CurrentUser } from '@/infra/auth/current-user.decorator';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import { ZodValidationPipe } from '../pipes/zod-validation.pipe';
import { QuestionPresenter } from '../presenters/question';

const BodySchema = z.object({
  title: z.string(),
  content: z.string(),
});

type Body = z.infer<typeof BodySchema>;

const BodyValidationPipe = new ZodValidationPipe(BodySchema);

@Controller('/questions')
export class CreateQuestionController {
  constructor(private createQuestion: CreateQuestionUseCase) {}

  @Post()
  @HttpCode(201)
  async handle(
    @CurrentUser() user: UserPayload,
    @Body(BodyValidationPipe) body: Body,
  ) {
    const userId = user.sub;
    const { title, content } = body;

    const result = await this.createQuestion.execute({
      title,
      content,
      authorId: userId,
      attachmentsIds: [],
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }

    const question = result.value.question;

    return {
      question: QuestionPresenter.toHTTP(question),
    };
  }
}
