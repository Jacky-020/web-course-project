import { Controller, Post, Get, Req, UseGuards } from '@nestjs/common';
import { LocalAuthGuard, NoAuth } from './auth.guard';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
    @UseGuards(LocalAuthGuard)
    @NoAuth()
    @Post('login')
    login(@Req() req: Request) {
        return req.user;
    }
    @Post('logout')
    logout(@Req() req: Request) {
        req.logout(() => {});
        return 'null';
    }

    @Get('user')
    @NoAuth()
    user(@Req() req: Request) {
        if (!req.user) return 'null';

        return req.user;
    }
}
