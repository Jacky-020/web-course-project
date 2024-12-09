import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import ViteExpress from 'vite-express';
import { ExpressAdapter } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, new ExpressAdapter());
  await app.init();
  ViteExpress.listen(app.getHttpAdapter().getInstance(), 3000);
}
bootstrap();
