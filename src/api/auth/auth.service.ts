import { createParamDecorator, ExecutionContext, Injectable } from '@nestjs/common';
import { UserService } from 'src/api/user/user.service';
import { compare } from 'bcrypt';
import { GqlExecutionContext } from '@nestjs/graphql';
import { OmitType } from '@nestjs/mapped-types';
import { User } from '../user/user.schema';

@Injectable()
export class AuthService {
    constructor(private userService: UserService) {}
    async validateUser(username: string, password: string): Promise<ReqUser | string> {
        const user = await this.userService.getFromUsername(username);
        if (!user) {
            return 'User does not exist!';
        }
        const ok = await compare(password, user.password);
        if (ok) {
            return {
                id: user.id,
                username: user.username,
                email: user.email,
                roles: user.roles,
            };
        } else {
            return 'Incorrect password!';
        }
    }
}

// Inject the current user into params of controllers/resolvers
export const LoginUser = createParamDecorator(
    (data: unknown, ctx: ExecutionContext): SessionUser => {
        const req = ctx.switchToHttp().getRequest() || GqlExecutionContext.create(ctx).getContext().req;
        return req.user;
    }
);

// type returned from above `validateUser`
export class SessionUser extends OmitType(User, ['password'] as const) {
    id: string;
}
