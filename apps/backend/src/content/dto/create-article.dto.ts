import { IsArray, IsOptional, IsString } from 'class-validator';

export class CreateArticleDto {
  @IsString()
  title!: string;

  @IsString()
  summary!: string;

  @IsString()
  body!: string;

  @IsOptional()
  @IsArray()
  tags?: string[];
}
