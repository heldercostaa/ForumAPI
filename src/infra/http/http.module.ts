import { Module } from '@nestjs/common';

import { CreateQuestionUseCase } from '@/domain/forum/application/use-cases/create-question';
import { ListRecentQuestionsUseCase } from '@/domain/forum/application/use-cases/list-recent-questions';
import { DatabaseModule } from '../database/database.module';
import { AuthenticateController } from './controllers/authenticate.controller';
import { CreateAccountController } from './controllers/create-account.controller';
import { CreateQuestionController } from './controllers/create-question.controller';
import { ListRecentQuestionsController } from './controllers/list-recent-questions.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [
    CreateAccountController,
    AuthenticateController,
    CreateQuestionController,
    ListRecentQuestionsController,
  ],
  providers: [CreateQuestionUseCase, ListRecentQuestionsUseCase],
})
export class HttpModule {}
