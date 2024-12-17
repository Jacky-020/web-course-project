import { Body, Controller, Post } from '@nestjs/common';
import { EventsService } from './events.service';
import { Roles } from '../auth/auth.guard';
import { Role } from '../user/user.schema';

@Controller('events')
export class EventsController {
    constructor(private readonly eventsService: EventsService) {}
    @Post('fetch')
    @Roles([Role.Admin])
    fetchFromSource(@Body() body?: {force: boolean}) {
        // { "force": true } to force update
        this.eventsService.fetchFromSource(body.force);
        return {
            "updated_at": new Date(Date.now()).toISOString()
        }
    }
}
