import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { LocalAuthGuard, NoAuth } from './auth.guard';

@Controller('auth')
export class AuthController {
    @UseGuards(LocalAuthGuard)
    @NoAuth()
    @Post('login')
    login(@Req() req) {
        // TODO: Add typing to req
        return req.user;
    }
    @Post('logout')
    logout(@Req() req) {
        req.logout(() => {});
        return "Logged out successfully."
    }
}
