import { Body, Controller, Post } from '@nestjs/common';
import { Role, User } from './user.schema';
import { OmitType } from '@nestjs/mapped-types'
import { UserService } from './user.service';
import { NoAuth } from 'src/api/auth/auth.guard';

// omit the roles field when asking for user creation
export class UserCreationDto extends OmitType(User, ['roles'] as const) {}

@Controller('user')
export class UserController {
    constructor(private userService: UserService) {}
    @Post('register')
    @NoAuth()
    async register(@Body() body: UserCreationDto) {
        // only users can be registered
        const user: User = {
            ...body,
            roles: [Role.User]
        }
        await this.userService.create(user);
        return 'User created.'
    }
}
