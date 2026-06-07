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
  async create(createSnippetDto: CreateSnippetDto) {
    // A. Hand the raw code to Google Gemini and wait for the JSON response
    const aiMetadata = await this.aiService.analyzeSnippet(createSnippetDto.code);

    // B. Save the user's data PLUS the AI's metadata to the database
    return this.prisma.snippet.create({
      data: {
        title: createSnippetDto.title,
        code: createSnippetDto.code,
        author: createSnippetDto.author,
        
        // Map the AI-generated fields:
        summary: aiMetadata.summary,
        tags: JSON.stringify(aiMetadata.tags), // Convert array to string for SQLite
        vulnerabilities: aiMetadata.vulnerabilities,
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