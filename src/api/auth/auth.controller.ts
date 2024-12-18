import { Controller, Post, Get, Req, UseGuards } from '@nestjs/common';
import { LocalAuthGuard, NoAuth } from './auth.guard';
import { Request } from 'express';
import { LocationsService } from '../locations/locations.service';
import { EventsService } from '../events/events.service';

@Controller('auth')
export class AuthController {
    constructor(private readonly locationsService: LocationsService, private readonly eventsService: EventsService) {}
    @UseGuards(LocalAuthGuard)
    @NoAuth()
    @Post('login')
    login(@Req() req: Request) {
        this.locationsService.fetchFromSource().then(() => {
            this.eventsService.fetchFromSource();
        });
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
