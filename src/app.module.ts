import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SnippetsModule } from './snippets/snippets.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [SnippetsModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
