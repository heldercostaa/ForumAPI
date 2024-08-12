import { AuthenticateStudentUseCase } from '@/domain/forum/application/use-cases/authenticate-student';
import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import z from 'zod';
import { ZodValidationPipe } from '../pipes/zod-validation.pipe';

const BodySchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

type Body = z.infer<typeof BodySchema>;

@Controller('/sessions')
@UsePipes(new ZodValidationPipe(BodySchema))
export class AuthenticateController {
  constructor(private authenticateStudent: AuthenticateStudentUseCase) {}

  @Post()
  async handle(@Body() body: Body) {
    const { email, password } = body;

    const result = await this.authenticateStudent.execute({ email, password });

    if (result.isLeft()) {
      throw new Error();
    }

    const { accessToken } = result.value;

    return { accessToken };
  }
}
