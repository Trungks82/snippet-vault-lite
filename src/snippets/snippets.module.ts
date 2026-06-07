import { Module } from '@nestjs/common';
import { SnippetsService } from './snippets.service';
import { SnippetsController } from './snippets.controller';
import { AiModule } from '../ai/ai.module'; // 👈 1. Import the AiModule

@Module({
  imports: [AiModule], // 👈 2. Add it to the imports array!
  controllers: [SnippetsController],
  providers: [SnippetsService]
})
export class SnippetsModule {}