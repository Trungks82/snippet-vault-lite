import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

/**
 * @Global() because nearly every feature module needs database access.
 * Without it, AuthModule and SnippetsModule would each have to add
 * `imports: [PrismaModule]` — harmless, but noisy. Global modules are
 * an exception to "be explicit"; the DB layer is the canonical use case.
 */
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
