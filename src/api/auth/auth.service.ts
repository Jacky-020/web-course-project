import { Injectable } from '@nestjs/common';
import { UserService } from 'src/api/user/user.service';
import { compare } from 'bcrypt';
import { User } from 'src/api/user/user.schema';

@Injectable()
export class AuthService {
    constructor(private userService: UserService) {}
    async validateUser(username: string, password: string): Promise<User | string> {
        const user = await this.userService.get(username);
        if (user === undefined) {
            return 'User does not exist!';
        }
        let ok = await compare(password, user.password);
        if (ok) {
            return user;
        } else {
            return 'Incorrect password!';
        }
    }
}
