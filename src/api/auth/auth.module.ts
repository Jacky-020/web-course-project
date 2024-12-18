import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { LocalStrategy } from './auth.strategy';
import { UserModule } from 'src/api/user/user.module';
import { PassportModule } from '@nestjs/passport';
import { SessionSerializer } from './session';
import { EventsModule } from '../events/events.module';
import { LocationsModule } from '../locations/locations.module';

@Module({
    imports: [UserModule, PassportModule.register({ session: true }), LocationsModule, EventsModule],
    providers: [AuthService, LocalStrategy, SessionSerializer],
    controllers: [AuthController],
})
export class AuthModule {}
