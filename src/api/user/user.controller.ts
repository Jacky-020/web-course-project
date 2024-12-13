import { Body, Controller, Post, Req } from '@nestjs/common';
import { Role, User } from './user.schema';
import { PickType } from '@nestjs/mapped-types';
import { UserService } from './user.service';
import { NoAuth } from 'src/api/auth/auth.guard';
import { Request } from 'express';

// only require username, email and password
export class UserCreationDto extends PickType(User, ['username', 'email', 'password'] as const) {}

@Controller('user')
export class UserController {
    constructor(private userService: UserService) {}
    @Post('register')
    @NoAuth()
    async register(@Body() body: UserCreationDto, @Req() req: Request) {
        // only users can be registered
        const user: User = {
            ...body,
            roles: [Role.User],
        };
        const newUser = await this.userService.create(user);
        const reqUser: ReqUser = {
            id: newUser.id,
            username: newUser.username,
            email: newUser.email,
            roles: newUser.roles,
        };

        await new Promise<void>((resolve, reject) => {
            req.login(reqUser, (err) => {
                if (err) return reject(err);
                return resolve();
            });
        });

        return req.user;
    }
}
