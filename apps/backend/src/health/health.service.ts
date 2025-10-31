import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

export interface HealthReport {
  status: 'ok' | 'degraded' | 'down';
  uptime: number;
  timestamp: string;
  version: string;
  environment: string;
  checks: {
    database: 'up' | 'down';
  };
  system: {
    nodeVersion: string;
    memory: {
      rss: number;
      heapTotal: number;
      heapUsed: number;
    };
  };
  metadata?: {
    commitSha?: string | null;
  };
}

@Injectable()
export class HealthService {
  constructor(private readonly prisma: PrismaService, private readonly configService: ConfigService) {}

  async getHealth(): Promise<HealthReport> {
    const checks: HealthReport['checks'] = { database: 'up' };

    try {
      await this.prisma.$queryRaw(Prisma.sql`SELECT 1`);
    } catch (error) {
      checks.database = 'down';
    }

    const status = checks.database === 'up' ? 'ok' : 'degraded';

    const memoryUsage = process.memoryUsage();
    const toMb = (value: number) => Number((value / 1024 / 1024).toFixed(2));

    const system = {
      nodeVersion: process.version,
      memory: {
        rss: toMb(memoryUsage.rss),
        heapTotal: toMb(memoryUsage.heapTotal),
        heapUsed: toMb(memoryUsage.heapUsed)
      }
    };

    const metadata: HealthReport['metadata'] = {
      commitSha: this.configService.get<string>('COMMIT_SHA') ?? null
    };

    return {
      status,
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      version: this.configService.get<string>('npm_package_version') ?? '0.0.0',
      environment: this.configService.get<string>('NODE_ENV') ?? 'development',
      checks,
      system,
      metadata
    };
  }
}
