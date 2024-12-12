import {
    CanActivate,
    ExecutionContext,
    Injectable,
    SetMetadata,
    UnauthorizedException,
    ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { Request } from 'express';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
    async canActivate(context: ExecutionContext) {
        const activate = (await super.canActivate(context)) as boolean;
        const request = context.switchToHttp().getRequest();
        await super.logIn(request);
        return activate;
    }
}

export const Roles = Reflector.createDecorator<string[]>();

export const NoAuth = () => SetMetadata('noAuth', true);

@Injectable()
export class RoleGuard implements CanActivate {
    constructor(private reflector: Reflector) {}
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        if (this.reflector.get('noAuth', context.getHandler())) return true;
        const req: Request = context.switchToHttp().getRequest();
        const routeRoles = this.reflector.get(Roles, context.getHandler()) || [];
        // Use use Role([]) for routes limited to all authenticated users
        if (req.isAuthenticated()) {
            const userRoles = req.user.roles as string[];
            if (routeRoles.length != 0 && userRoles.some((role) => routeRoles.includes(role)))
                throw new ForbiddenException('You do not have permission to access this resource.');
            return true;
        }

        throw new UnauthorizedException('You must be logged in!');
    }
}
