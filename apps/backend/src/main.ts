import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { rateLimitMiddleware } from './middlewares/rate-limit.middleware';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());

  // Use Helmet middleware for security headers
  app.use(helmet());

  // Use the rate limit middleware
  app.use(rateLimitMiddleware);

  await app.listen(3000);
}
bootstrap();
