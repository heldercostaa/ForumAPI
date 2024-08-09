import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { Controller, Get, Query } from '@nestjs/common';
import z from 'zod';
import { ZodValidationPipe } from '../pipes/zod-validation.pipe';

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
  constructor(private prisma: PrismaService) {}

  @Get()
  async handle(@Query('page', QueryValidationPipe) page: Query) {
    const pageSize = 10;

    const questions = await this.prisma.question.findMany({
      orderBy: { createdAt: 'desc' },
      take: pageSize,
      skip: (page - 1) * pageSize,
    });

    return { questions };
  }
}
