import { ZodValidationPipe } from '@/pipes/zod-validation.pipe';
import { PrismaService } from '@/prisma/prisma.service';
import {
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
  UsePipes,
} from '@nestjs/common';
import { hash } from 'bcryptjs';
import z from 'zod';

const BodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
});

type Body = z.infer<typeof BodySchema>;

@Controller('/accounts')
export class CreateAccountController {
  constructor(private prisma: PrismaService) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(BodySchema))
  async handle(@Body() body: Body) {
    const { name, email, password } = body;

    const userExists = await this.prisma.user.findUnique({ where: { email } });

    if (userExists) {
      throw new ConflictException('Account with e-mail already exists');
    }

    const hashedPassword = await hash(password, 8);

    await this.prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });
  }
}
