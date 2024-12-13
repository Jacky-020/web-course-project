import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import session from 'express-session';
import passport from 'passport'
import dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule, new ExpressAdapter());

  app.use(
    session({
      secret: process.env.SERVER_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 604800, // 7 days
      },
    }),
  );
  app.use(passport.session());
  app.useGlobalPipes(new ValidationPipe());

  app.setGlobalPrefix('api');
  await app.listen(3000);
}
bootstrap();
