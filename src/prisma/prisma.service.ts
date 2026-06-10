import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';

/**
 * One PrismaClient for the whole app.
 *
 * Why extend PrismaClient instead of wrapping it?
 * - Services inject PrismaService and call `this.prisma.snippet.findMany(...)`
 *   exactly like before — zero API change, but now there's a single shared
 *   connection instead of one per service.
 *
 * Why the lifecycle hooks?
 * - Nest owns the app lifecycle, so it should own the DB connection too.
 *   $connect() on startup surfaces config errors immediately (fail fast),
 *   and $disconnect() on shutdown releases the SQLite file handle cleanly.
 */
@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(configService: ConfigService) {
    const url =
      configService.get<string>('DATABASE_URL') ?? 'file:./dev.db';
    super({ adapter: new PrismaBetterSqlite3({ url }) });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
