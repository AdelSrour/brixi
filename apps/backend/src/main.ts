import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { rateLimitMiddleware } from './middlewares/rate-limit.middleware';
import { errorHandlerMiddleware } from './middlewares/error-handler.middleware';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1');

  app.useGlobalPipes(new ValidationPipe());
  app.use(helmet());
  app.use(rateLimitMiddleware);

  // Register the error handler middleware as the last middleware
  app.use(errorHandlerMiddleware);

  await app.listen(3000);
}
bootstrap();
