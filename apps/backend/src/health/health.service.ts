import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

export interface HealthReport {
  status: 'ok' | 'degraded' | 'down';
  uptime: number;
  timestamp: string;
  version: string;
  checks: {
    database: 'up' | 'down';
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

    return {
      status,
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      version: this.configService.get<string>('npm_package_version') ?? '0.0.0',
      checks
    };
  }
}
