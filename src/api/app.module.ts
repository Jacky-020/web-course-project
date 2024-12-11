import { Logger, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { RenderFilter } from './render.filter';

import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { APP_GUARD, APP_FILTER } from '@nestjs/core';
import { RoleGuard } from './auth/auth.guard';

@Module({
  imports: [
    ConfigModule.forRoot(),
    AuthModule,
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/', {
      onConnectionCreate: (connection) => {
        connection.on('connected', () =>
          Logger.log('Connected to database', 'MongoDB'),
        );
      },
    }),
    UserModule,
  ],
  controllers: [AppController],

  // by default, all routes are protected;
  // use @NoAuth to unprotect a route, use @Roles(['user', 'admin']) to specify allowed roles
  // @Roles() means any authenticated user.
  providers: [
    AppService,
    { provide: APP_FILTER, useClass: RenderFilter },
    { provide: APP_GUARD, useClass: RoleGuard },
  ],
})
export class AppModule {}
