import { Injectable } from '@nestjs/common';
import { CreateSnippetDto } from './dto/create-snippet.dto';
import { UpdateSnippetDto } from './dto/update-snippet.dto';

@Injectable()
export class SnippetsService {
  private readonly vault: any[] = [];

  create(createSnippetDto: CreateSnippetDto) {
    // Add an ID, timestamp, and status to the incoming snippet
    const newSnippet = {
      id: this.vault.length + 1,
      ...createSnippetDto,
      createdAt: new Date().toISOString(),
      status: 'pending_ai_review' 
    };
    
    // Save it to the vault array
    this.vault.push(newSnippet);
    
    // Return the newly saved snippet back to the controller
    return newSnippet;
  }

  findAll() {
    // Return everything currently stored in the vault
    return this.vault;
  }

  findOne(id: number) {
    return `This action returns a #${id} snippet`;
  }

  update(id: number, updateSnippetDto: UpdateSnippetDto) {
    return `This action updates a #${id} snippet`;
  }

  remove(id: number) {
    return `This action removes a #${id} snippet`;
  }
}
