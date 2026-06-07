import { Module } from '@nestjs/common';
import { AiService } from './ai.service';

@Module({
  providers: [AiService],
  exports: [AiService], // We export this so the upcoming SnippetController can use it!
})
export class AiModule {}