import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import configuration from './config/configuration';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ContentModule } from './content/content.module';
import { NotesModule } from './notes/notes.module';
import { AdminModule } from './admin/admin.module';
import { AuditInterceptor } from './common/interceptors/audit.interceptor';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration]
    }),
    ThrottlerModule.forRoot([
      {
        name: 'global',
        ttl: 60,
        limit: 120
      }
    ]),
    PrismaModule,
    AuthModule,
    UsersModule,
    ContentModule,
    NotesModule,
    AdminModule
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: AuditInterceptor
    }
  ]
})
export class AppModule {}
