import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ThrottlerGuard } from '@nestjs/throttler';
import { RateLimiterMemory } from 'rate-limiter-flexible';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.use(helmet({
    contentSecurityPolicy: false
  }));

  app.enableCors({
    origin: configService.get<string>('CORS_ORIGIN', '*'),
    credentials: true
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
