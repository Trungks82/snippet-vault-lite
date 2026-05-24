import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateSnippetDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsNotEmpty()
  code!: string;

  @IsString()
  @IsNotEmpty()
  author!: string;
  
  @IsString()
  @IsOptional() 
  language?: string;
}