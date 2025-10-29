import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { RefreshStrategy } from './strategies/refresh.strategy';
import { LocalStrategy } from './strategies/local.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({})
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, RefreshStrategy, LocalStrategy],
  exports: [AuthService]
})
export class AuthModule {}
