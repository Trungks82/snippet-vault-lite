import { Injectable } from '@nestjs/common';
import { CreateSnippetDto } from './dto/create-snippet.dto';
import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';

@Injectable()
export class SnippetsService {
  private prisma: PrismaClient;

  constructor() {
    // 1. We create the specific SQLite Adapter and hand it the database address
    const adapter = new PrismaBetterSqlite3({ url: "file:./dev.db" });
    
    // 2. We hire Prisma and give it the Adapter so it knows exactly how to talk to SQLite
    this.prisma = new PrismaClient({ adapter });
  }

  create(createSnippetDto: CreateSnippetDto) {
    return this.prisma.snippet.create({
      data: createSnippetDto, 
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