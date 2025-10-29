import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpsertNoteDto } from './dto/upsert-note.dto';

@Injectable()
export class NotesService {
  constructor(private readonly prisma: PrismaService) {}

  list(userId: string) {
    return this.prisma.note.findMany({ where: { userId }, orderBy: { updatedAt: 'desc' } });
  }

  upsert(userId: string, dto: UpsertNoteDto) {
    return this.prisma.note.upsert({
      where: {
        userId_contextId: {
          userId,
          contextId: dto.contextId ?? 'default'
        }
      },
      create: {
        userId,
        title: dto.title,
        content: dto.content,
        contextId: dto.contextId ?? 'default'
      },
      update: {
        title: dto.title,
        content: dto.content
      }
    });
  }

  delete(userId: string, contextId: string) {
    return this.prisma.note.delete({
      where: {
        userId_contextId: {
          userId,
          contextId
        }
      }
    });
  }
}
