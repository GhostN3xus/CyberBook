import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(private readonly prisma: PrismaService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    return next.handle().pipe(
      tap(async () => {
        if (!user) {
          return;
        }
        await this.prisma.auditLog.create({
          data: {
            userId: user.userId,
            action: `${request.method} ${request.url}`,
            metadata: request.body
          }
        });
      })
    );
  }
}
