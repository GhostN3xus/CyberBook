import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ContentService } from './content.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';

@Controller('content')
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @Get('vulnerabilities')
  listVulnerabilities() {
    return this.contentService.listVulnerabilities();
  }

  @Get('articles')
  listArticles() {
    return this.contentService.listArticles();
  }

  @Get('docs')
  listDocs() {
    return this.contentService.listDocs();
  }

  @Get('tools')
  listTools() {
    return this.contentService.listTools();
  }

  @Post('articles')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('editor', 'admin')
  createArticle(@Body() dto: CreateArticleDto) {
    return this.contentService.createArticle(dto);
  }

  @Patch('articles/:id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('editor', 'admin')
  updateArticle(@Param('id') id: string, @Body() dto: UpdateArticleDto) {
    return this.contentService.updateArticle(id, dto);
  }

  @Delete('articles/:id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  deleteArticle(@Param('id') id: string) {
    return this.contentService.deleteArticle(id);
  }
}
