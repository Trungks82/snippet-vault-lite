import { Injectable } from '@nestjs/common';
import { CreateSnippetDto } from './dto/create-snippet.dto';
import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { AiService } from '../ai/ai.service'; // 👈 1. Import the AI Brain

@Injectable()
export class SnippetsService {
  private prisma: PrismaClient;

  // 👈 2. Inject the AiService just like you would in an Angular Component
  constructor(private aiService: AiService) {
    const adapter = new PrismaBetterSqlite3({ url: "file:./dev.db" });
    this.prisma = new PrismaClient({ adapter });
  }

  // 👇 3. The AI Orchestration Pipeline
  // Add userId as the second parameter here 👇
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
        
        userId: userId, // 👈 Bind the User ID to the Snippet!
      },
    });
  }

  findAll() {
    return this.prisma.snippet.findMany();
  }

  findOne(id: number) {
    return this.prisma.snippet.findUnique({
      where: { id: id }
    });
  }

  update(id: number, updateData: any) {
    return this.prisma.snippet.update({
      where: { id: id },
      data: updateData,
    });
  }

  remove(id: number) {
    return this.prisma.snippet.delete({
      where: { id: id }
    });
  }
}