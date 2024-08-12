import { Body, Controller, HttpCode, Post, UsePipes } from '@nestjs/common';
import z from 'zod';

import { RegisterStudentUseCase } from '@/domain/forum/application/use-cases/register-student';
import { ZodValidationPipe } from '../pipes/zod-validation.pipe';

const BodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
});

type Body = z.infer<typeof BodySchema>;

@Controller('/accounts')
export class CreateAccountController {
  constructor(private registerStudent: RegisterStudentUseCase) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(BodySchema))
  async handle(@Body() body: Body) {
    const { name, email, password } = body;

    const result = await this.registerStudent.execute({
      name,
      email,
      password,
    });

    if (result.isLeft()) {
      throw new Error();
    }

    const { student } = result.value;

    return {
      user: {
        id: student.id.toString(),
        name: student.name,
        email: student.email,
      },
    };
  }
}
