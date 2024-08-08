import { JwtGuard } from '@/auth/jwt.guard';
import { ZodValidationPipe } from '@/pipes/zod-validation.pipe';
import { PrismaService } from '@/prisma/prisma.service';
import {
  Body,
  Controller,
  HttpCode,
  Post,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import z from 'zod';

const bodySchema = z.object({});

type Body = z.infer<typeof bodySchema>;

@Controller('/questions')
@UseGuards(JwtGuard)
export class CreateQuestionController {
  constructor(private prisma: PrismaService) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(bodySchema))
  async handle(@Body() body: Body) {}
}
