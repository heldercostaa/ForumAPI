import { CreateQuestionUseCase } from '@/domain/forum/application/use-cases/create-question';
import { CurrentUser } from '@/infra/auth/current-user.decorator';
import { JwtGuard } from '@/infra/auth/jwt.guard';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import z from 'zod';
import { ZodValidationPipe } from '../pipes/zod-validation.pipe';

const BodySchema = z.object({
  title: z.string(),
  content: z.string(),
});

type Body = z.infer<typeof BodySchema>;

const BodyValidationPipe = new ZodValidationPipe(BodySchema);

@Controller('/questions')
@UseGuards(JwtGuard)
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

    const useCaseResponse = await this.createQuestion.execute({
      title,
      content,
      authorId: userId,
      attachmentsIds: [],
    });

    if (useCaseResponse.isLeft()) {
      throw new Error('Error creating question');
    }

    const question = useCaseResponse.value.question;

    // TODO: Create mapper for response
    return {
      question: {
        id: question.id.toString(),
        authorId: question.authorId.toString(),
        title: question.title,
        content: question.content,
        slug: question.slug.value,
      },
    };
  }
}
