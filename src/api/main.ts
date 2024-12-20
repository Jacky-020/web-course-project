import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import session from 'express-session';
import passport from 'passport'
import dotenv from 'dotenv';
import MongoStore from 'connect-mongo';

dotenv.config();
dotenv.config({ path: '.env.dev' });

async function bootstrap() {
  const app = await NestFactory.create(AppModule, new ExpressAdapter());

  app.use(
    session({
      secret: process.env.SERVER_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      },
      store: MongoStore.create({mongoUrl: process.env.MONGO_URL}),
    }),
  );
  app.use(passport.session());
  app.useGlobalPipes(new ValidationPipe());

  app.setGlobalPrefix('api');
  await app.listen(3000);
}
bootstrap();
