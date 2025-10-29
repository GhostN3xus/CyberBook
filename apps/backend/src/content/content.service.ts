import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';

@Injectable()
export class ContentService {
  constructor(private readonly prisma: PrismaService) {}

  listVulnerabilities() {
    return this.prisma.vulnerability.findMany({
      include: {
        references: true
      }
    });
  }

  listArticles() {
    return this.prisma.article.findMany({ orderBy: { publishedAt: 'desc' } });
  }

  createArticle(dto: CreateArticleDto) {
    return this.prisma.article.create({
      data: {
        title: dto.title,
        summary: dto.summary,
        body: dto.body,
        tags: dto.tags ?? []
      }
    });
  }

  async updateArticle(id: string, dto: UpdateArticleDto) {
    const article = await this.prisma.article.findUnique({ where: { id } });
    if (!article) {
      throw new NotFoundException('Article not found');
    }
    return this.prisma.article.update({ where: { id }, data: dto });
  }

  deleteArticle(id: string) {
    return this.prisma.article.delete({ where: { id } });
  }

  listDocs() {
    return this.prisma.officialDoc.findMany({ orderBy: { title: 'asc' } });
  }

  listTools() {
    return this.prisma.tool.findMany({ orderBy: { title: 'asc' } });
  }
}
