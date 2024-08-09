import { CurrentUser } from '@/infra/auth/current-user.decorator';
import { JwtGuard } from '@/infra/auth/jwt.guard';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
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
  constructor(private prisma: PrismaService) {}

  @Post()
  @HttpCode(201)
  async handle(
    @CurrentUser() user: UserPayload,
    @Body(BodyValidationPipe) body: Body,
  ) {
    const userId = user.sub;
    const { title, content } = body;

    const question = await this.prisma.question.create({
      data: {
        authorId: userId,
        title,
        content,
        slug: this.convertToSlug(title),
      },
    });

    return {
      question: {
        id: question.id,
        authorId: question.authorId,
        title: question.title,
        content: question.content,
        slug: question.slug,
      },
    };
  }

  private convertToSlug(text: string) {
    const slug = text
      .normalize('NFKD')
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '')
      .replace(/_/g, '')
      .replace(/--+/g, '-')
      .replace(/-$/g, '');

    return slug;
  }
}
