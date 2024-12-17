import { Controller, Post } from '@nestjs/common';
import { LocationsService } from './locations.service';
import { Roles } from '../auth/auth.guard';
import { Role } from '../user/user.schema';

@Controller('locations')
export class LocationsController {
    constructor(private locationsService: LocationsService) {}
    @Post('fetch')
    @Roles([Role.Admin])
    async fetch() {
        this.locationsService.fetchFromSource();
        return `Requested updating locations at ${(new Date(Date.now())).toString()}`
    }
}
