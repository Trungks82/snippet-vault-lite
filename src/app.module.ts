import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SnippetsModule } from './snippets/snippets.module';

@Module({
  imports: [SnippetsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
