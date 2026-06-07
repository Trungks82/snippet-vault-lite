import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { SnippetsService } from './snippets.service';
import { CreateSnippetDto } from './dto/create-snippet.dto';
import { UpdateSnippetDto } from './dto/update-snippet.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard) // Guard the whole controller, not just create()
@Controller('snippets')
export class SnippetsController {
  constructor(private readonly snippetsService: SnippetsService) {}

  @Post()
  create(@Body() createSnippetDto: CreateSnippetDto, @Req() req: any) {
    return this.snippetsService.create(createSnippetDto, req.user.sub);
  }

  @Get()
  findAll(@Req() req: any) {
    return this.snippetsService.findAll(req.user.sub);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: any) {
    return this.snippetsService.findOne(+id, req.user.sub);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSnippetDto: UpdateSnippetDto,
    @Req() req: any,
  ) {
    return this.snippetsService.update(+id, updateSnippetDto, req.user.sub);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: any) {
    return this.snippetsService.remove(+id, req.user.sub);
  }
}