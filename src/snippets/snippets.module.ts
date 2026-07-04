import { Module } from '@nestjs/common';
import { SnippetsService } from './snippets.service';
import { SnippetsController } from './snippets.controller';
import { AiModule } from '../ai/ai.module';
import { BullModule } from '@nestjs/bullmq';

@Module({
  imports: [
    AiModule,
    BullModule.registerQueue({
      name: 'snippet-analysis',
    }),
  ],
  controllers: [SnippetsController],
  providers: [SnippetsService],
})
export class SnippetsModule {}
