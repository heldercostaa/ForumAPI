import { CurrentUser } from '@/auth/current-user.decorator';
import { JwtGuard } from '@/auth/jwt.guard';
import { UserPayload } from '@/auth/jwt.strategy';
import { ZodValidationPipe } from '@/pipes/zod-validation.pipe';
import { PrismaService } from '@/prisma/prisma.service';
import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import z from 'zod';

const bodySchema = z.object({
  title: z.string(),
  content: z.string(),
});

type Body = z.infer<typeof bodySchema>;

@Controller('/questions')
@UseGuards(JwtGuard)
export class CreateQuestionController {
  constructor(private prisma: PrismaService) {}

  @Post()
  @HttpCode(201)
  async handle(
    @CurrentUser() user: UserPayload,
    @Body(new ZodValidationPipe(bodySchema)) body: Body,
  ) {
    const userId = user.sub;
    const { title, content } = body;

    await this.prisma.question.create({
      data: {
        authorId: userId,
        title,
        content,
        slug: this.convertToSlug(title),
      },
    });
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
