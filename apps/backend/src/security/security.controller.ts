import { Body, Controller, HttpCode, HttpStatus, Logger, Post } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';

type CspReportPayload = Record<string, unknown>;

function sanitizeReport(report: CspReportPayload): CspReportPayload {
  return Object.entries(report).reduce<CspReportPayload>((acc, [key, value]) => {
    if (typeof value === 'string') {
      acc[key] = value.replace(/[\u0000-\u001F\u007F]/g, '').slice(0, 1024);
    } else {
      acc[key] = value;
    }
    return acc;
  }, {});
}

@Controller('api/csp-report')
export class SecurityController {
  private readonly logger = new Logger(SecurityController.name);

  @Post()
  @HttpCode(HttpStatus.NO_CONTENT)
  @Throttle(100, 900)
  handleCspReport(@Body() body: Record<string, CspReportPayload | undefined>) {
    const report = body['csp-report'] ?? body.report;

    if (report && typeof report === 'object' && !Array.isArray(report)) {
      const sanitizedReport = sanitizeReport(report);
      this.logger.warn(`CSP violation reported: ${JSON.stringify(sanitizedReport)}`);
    }
  }
}
