import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import ViteExpress from 'vite-express';
import { db } from './db';
import { ExpressAdapter } from '@nestjs/platform-express';

db.once('open', async () => {
  console.log('MongoDB Connected!');
});

async function bootstrap() {
  const app = await NestFactory.create(AppModule, new ExpressAdapter());
  app.setGlobalPrefix('api');
  await app.init();
  ViteExpress.listen(app.getHttpAdapter().getInstance(), 3000);
}
bootstrap();
