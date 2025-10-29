import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async getDashboard() {
    const [vulnerabilityCount, articleCount, lastBackup] = await Promise.all([
      this.prisma.vulnerability.count(),
      this.prisma.article.count(),
      this.prisma.auditLog.findFirst({ orderBy: { createdAt: 'desc' } })
    ]);

    return {
      vulnerabilityCount,
      articleCount,
      lastBackup: lastBackup?.createdAt ?? null
    };
  }

  listAuditLogs() {
    return this.prisma.auditLog.findMany({ orderBy: { createdAt: 'desc' }, take: 50 });
  }
}
