import { BadRequestException, Controller, Param, Patch } from '@nestjs/common';

import { ChooseQuestionBestAnswerUseCase } from '@/domain/forum/application/use-cases/choose-question-best-answer';
import { CurrentUser } from '@/infra/auth/current-user.decorator';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import { QuestionPresenter } from '../presenters/question';

@Controller('/answers/:answerId/choose-as-best')
export class ChoseQuestionBestAnswerController {
  constructor(
    private choseQuestionBestAnswer: ChooseQuestionBestAnswerUseCase,
  ) {}

  @Patch()
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('answerId') answerId: string,
  ) {
    const userId = user.sub;

    const result = await this.choseQuestionBestAnswer.execute({
      answerId,
      authorId: userId,
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
