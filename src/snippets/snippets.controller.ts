import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { SnippetsService } from './snippets.service';
import { CreateSnippetDto } from './dto/create-snippet.dto';
import { UpdateSnippetDto } from './dto/update-snippet.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard'; // 👈 1. Import the security guard

@Controller('snippets')
export class SnippetsController {
  constructor(private readonly snippetsService: SnippetsService) {}

  @UseGuards(JwtAuthGuard) // 👈 2. Lock the door! Require a valid JWT token.
  @Post()
  create(@Body() createSnippetDto: CreateSnippetDto, @Req() req: any) { // 👈 3. Intercept the Request
    console.log('🚨 PR-Brain intercepted new code:', createSnippetDto);
    
    // 👇 4. Grab the User ID (sub) from the verified JWT payload
    const userId = req.user.sub; 
    
    // 👇 5. Pass both the code AND the user ID down to the service
    return this.snippetsService.create(createSnippetDto, userId);
  }

  @Get()
  findAll() {
    return this.snippetsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.snippetsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSnippetDto: UpdateSnippetDto) {
    return this.snippetsService.update(+id, updateSnippetDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.snippetsService.remove(+id);
  }
}