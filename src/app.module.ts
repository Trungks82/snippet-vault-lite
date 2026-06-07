import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { AiModule } from './ai/ai.module';
import { SnippetsModule } from './snippets/snippets.module';
@Module({
  imports: [
    ConfigModule.forRoot({ 
      isGlobal: true,
      envFilePath: '.env', 
    }),
    AuthModule,
    AiModule,
    SnippetsModule,
  ],
})
export class AppModule {}