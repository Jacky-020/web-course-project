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

    deserializeUser(id: string, done: (err: Error, user: ReqUser) => void): void {
        this.userService.getFromId(id).then((user) => {
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
