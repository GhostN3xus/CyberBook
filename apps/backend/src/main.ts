import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ThrottlerGuard } from '@nestjs/throttler';
import { RateLimiterMemory } from 'rate-limiter-flexible';
import { randomBytes } from 'crypto';
import { json, urlencoded } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const rawOrigins = configService.get<string>('CORS_ORIGIN');
  const allowedOrigins = (rawOrigins
    ? rawOrigins
        .split(',')
        .map((origin) => origin.trim())
        .filter((origin) => origin && origin !== '*')
    : ['http://localhost:3000']);

  if (allowedOrigins.length === 0) {
    allowedOrigins.push('http://localhost:3000');
  }

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['X-CSP-Nonce'],
    maxAge: 600
  });
  
  app.use(json({ limit: '1mb' }));
  app.use(urlencoded({ extended: true, limit: '1mb' }));
  app.use((req, res, next) => {
    const nonce = randomBytes(16).toString('base64');
    (res.locals ??= {}).cspNonce = nonce;

    helmet({
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          ...helmet.contentSecurityPolicy.getDefaultDirectives(),
          'default-src': ["'self'"],
          'script-src': ["'self'", `'nonce-${nonce}'`],
          'style-src': ["'self'", "'unsafe-inline'"],
          'img-src': ["'self'", 'data:'],
          'object-src': ["'none'"],
          'base-uri': ["'self'"],
          'frame-ancestors': ["'none'"],
          'connect-src': ["'self'"],
          'font-src': ["'self'", 'data:']
        }
      },
      crossOriginEmbedderPolicy: { policy: 'require-corp' },
      crossOriginOpenerPolicy: { policy: 'same-origin' },
      crossOriginResourcePolicy: { policy: 'same-origin' },
      referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
      frameguard: { action: 'deny' },
      hsts: { maxAge: 63072000, includeSubDomains: true, preload: true }
    })(req, res, (err?: unknown) => {
      if (err) {
        return next(err);
      }

      res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
      res.setHeader('X-Permitted-Cross-Domain-Policies', 'none');
      res.setHeader('X-CSP-Nonce', nonce);
      return next();
    });
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true
    })
  );

  const limiter = new RateLimiterMemory({ points: 20, duration: 1 });
  app.use(async (req, res, next) => {
    try {
      await limiter.consume(req.ip);
      next();
    } catch (err) {
      res.status(429).json({ message: 'Too many requests' });
    }
  });

  app.useGlobalGuards(app.get(ThrottlerGuard));

  const port = configService.get<number>('PORT', 4000);
  await app.listen(port, '0.0.0.0');
}

bootstrap();
