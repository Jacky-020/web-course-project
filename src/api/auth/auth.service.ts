import { Injectable } from '@nestjs/common';
import { UserService } from 'src/api/user/user.service';
import { compare } from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(private userService: UserService) {}
    async validateUser(username: string, password: string): Promise<ReqUser | string> {
        const user = await this.userService.get(username);
        if (!user) {
            return 'User does not exist!';
        }
        const ok = await compare(password, user.password);
        if (ok) {
            return {
                username: user.username,
                email: user.email,
                roles: user.roles,
            };
        } else {
            return 'Incorrect password!';
        }
    }
}
