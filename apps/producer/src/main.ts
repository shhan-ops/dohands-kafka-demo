import 'dotenv/config';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  const port = process.env.PRODUCER_PORT ?? 3000;
  await app.listen(port);

  console.log(`Producer app started on port ${port}`);
}

bootstrap();
