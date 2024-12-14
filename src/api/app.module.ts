import { Logger, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { APP_GUARD } from '@nestjs/core';
import { RoleGuard } from './auth/auth.guard';
import { LocationsModule } from './locations/locations.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env', '.env.dev'],
    }),
    AuthModule,
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get('MONGO_URL', 'mongodb://127.0.0.1:27017/'),
        onConnectionCreate: connection => {
          connection.on('connected', () => 
            Logger.log('Connected to database', 'MongoDB'),
          );
        }
      }),
      inject: [ConfigService],
    }),
    UserModule,
    LocationsModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: true,
      autoSchemaFile: true,
      formatError: (err) => ({ message: err.message, status: err.extensions.code }),
    }),
  ],
  controllers: [AppController],

  // by default, all routes are protected;
  // use @NoAuth to unprotect a route, use @Roles(['user', 'admin']) to specify allowed roles
  // @Roles() means any authenticated user.
  providers: [
    AppService,
    { provide: APP_GUARD, useClass: RoleGuard },
  ],
})
export class AppModule {}
