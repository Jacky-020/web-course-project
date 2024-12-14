import { Controller, Post } from '@nestjs/common';
import { EventsService } from './events.service';
import { Roles } from '../auth/auth.guard';
import { Role } from '../user/user.schema';

@Controller('events')
export class EventsController {
    constructor(private readonly eventsService: EventsService) {}
    @Post('fetch')
    @Roles([Role.Admin])
    fetchFromSource() {
        this.eventsService.fetchFromSource();
        return `Requested updating events at ${(new Date(Date.now())).toString()}`
    }
}
