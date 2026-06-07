import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSnippetDto } from './dto/create-snippet.dto';
import { UpdateSnippetDto } from './dto/update-snippet.dto';
import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { AiService } from '../ai/ai.service';

@Injectable()
export class SnippetsService {
  private prisma: PrismaClient;

  constructor(private aiService: AiService) {
    const adapter = new PrismaBetterSqlite3({ url: 'file:./dev.db' });
    this.prisma = new PrismaClient({ adapter });
  }

  async create(createSnippetDto: CreateSnippetDto, userId: number) {
    const aiMetadata = await this.aiService.analyzeSnippet(createSnippetDto.code);

    return this.prisma.snippet.create({
      data: {
        title: createSnippetDto.title,
        code: createSnippetDto.code,
        author: createSnippetDto.author,
        summary: aiMetadata.summary,
        tags: JSON.stringify(aiMetadata.tags),
        vulnerabilities: aiMetadata.vulnerabilities,
        userId,
      },
    });
  }

  findAll(userId: number) {
    return this.prisma.snippet.findMany({ where: { userId } });
  }

  async findOne(id: number, userId: number) {
    return this.findOwnedOrThrow(id, userId);
  }

  async update(id: number, updateData: UpdateSnippetDto, userId: number) {
    await this.findOwnedOrThrow(id, userId);
    return this.prisma.snippet.update({ where: { id }, data: updateData });
  }

  async remove(id: number, userId: number) {
    await this.findOwnedOrThrow(id, userId);
    return this.prisma.snippet.delete({ where: { id } });
  }

  // Only returns the row if it belongs to this user; otherwise 404.
  // Prevents one user reading/editing/deleting another user's snippet by id.
  private async findOwnedOrThrow(id: number, userId: number) {
    const snippet = await this.prisma.snippet.findFirst({
      where: { id, userId },
    });
    if (!snippet) throw new NotFoundException('Snippet not found');
    return snippet;
  }
}