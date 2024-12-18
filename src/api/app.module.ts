import { HttpStatus, Logger, Module } from '@nestjs/common';
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
import { EventsModule } from './events/events.module';
import { CommentsModule } from './comments/comments.module';
import { ObjectIDResolver } from 'graphql-scalars';

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
      resolvers: { ObjectID: ObjectIDResolver },
      plugins: [
        // ref: https://yylslolz.medium.com/adding-401-http-status-code-response-to-nestjs-graphql-endpoint-27c54bd555c5
        {
          async requestDidStart() {
            return {
              async willSendResponse(context) {
                const { response, errors } = context;
                if (errors) {
                  const error = errors[0];
                  // Set HTTP status code based on the error code
                  if (error.originalError.name === "UnauthorizedException") {
                    response.http.status = HttpStatus.UNAUTHORIZED;
                  }
                }
              },
            };
          },
        },
      ],
      subscriptions: {
        'graphql-ws': true,
      }
    }),
    EventsModule,
    CommentsModule,
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
