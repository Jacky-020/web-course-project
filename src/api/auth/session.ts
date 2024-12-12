import { PassportSerializer } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';

@Injectable()
export class SessionSerializer extends PassportSerializer {
    constructor(private userService: UserService) {
        super();
    }
    serializeUser(user: ReqUser, done: (err: Error, id: string) => void): void {
        done(null, user.id);
    }

    deserializeUser(id: string, done: (err: Error, user: ReqUser | null) => void): void {
        this.userService.getFromId(id).then((user) => {
            if (!user) return done(null, null);

            const reqUser: ReqUser = {
                id: user.id,
                username: user.username,
                email: user.email,
                roles: user.roles,
            };

            done(null, reqUser);
        });
    }
}
