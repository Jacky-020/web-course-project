import { CanActivate, ExecutionContext, Injectable, SetMetadata } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthGuard } from "@nestjs/passport";
import { Observable } from "rxjs";

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
    async canActivate(context: ExecutionContext) {
        const activate = (await super.canActivate(context)) as boolean;
        const request = context.switchToHttp().getRequest();
        await super.logIn(request);
        return activate;
    }
}

export const Roles = Reflector.createDecorator<String[]>();

export const NoAuth = () => SetMetadata('noAuth', true);

@Injectable()
export class RoleGuard implements CanActivate {
    constructor(private reflector: Reflector) {}
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        if (this.reflector.get('noAuth', context.getHandler())) return true;
        const req = context.switchToHttp().getRequest();
        const routeRoles = this.reflector.get(Roles, context.getHandler()) || [];
        // Use use Role([]) for routes limited to all authenticated users
        if (req.isAuthenticated()) {
            const userRoles = req.session.passport.user.roles as String[];
            return routeRoles.length == 0 || userRoles.some(role => routeRoles.includes(role));
        }
    }
}
