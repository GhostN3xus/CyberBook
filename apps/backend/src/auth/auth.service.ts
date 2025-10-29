import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import * as bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  async validateUser(email: string, pass: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const valid = await bcrypt.compare(pass, user.password);
    if (!valid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return user;
  }

  async login(data: LoginDto) {
    const user = await this.validateUser(data.email, data.password);
    // TODO: validate MFA token
    return this.issueTokens(user.id, user.email, user.role);
  }

  async register(dto: RegisterDto) {
    const hash = await bcrypt.hash(dto.password, 12);
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hash,
        role: 'viewer'
      }
    });
    return this.issueTokens(user.id, user.email, user.role);
  }

  async refresh(dto: RefreshTokenDto) {
    try {
      const payload = await this.jwtService.verifyAsync(dto.refreshToken, {
        secret: this.configService.get<string>('jwt.refreshSecret')
      });
      const user = await this.prisma.user.findUnique({ where: { id: payload.sub } });
      if (!user) {
        throw new UnauthorizedException('Invalid token');
      }
      return this.issueTokens(user.id, user.email, user.role);
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  private async issueTokens(userId: string, email: string, role: string) {
    const tokenId = uuid();
    const accessToken = await this.jwtService.signAsync(
      { sub: userId, email, role },
      {
        secret: this.configService.get<string>('jwt.accessSecret'),
        expiresIn: this.configService.get<string>('jwt.accessTtl')
      }
    );
    const refreshToken = await this.jwtService.signAsync(
      { sub: userId, email, jti: tokenId },
      {
        secret: this.configService.get<string>('jwt.refreshSecret'),
        expiresIn: this.configService.get<string>('jwt.refreshTtl')
      }
    );

    return {
      accessToken,
      refreshToken,
      expiresIn: this.configService.get<string>('jwt.accessTtl')
    };
  }
}
