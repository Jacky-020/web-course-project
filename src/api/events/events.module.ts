import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsResolver } from './events.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { Event, EventSchema } from './entities/event.entity';
import { LocationsModule } from '../locations/locations.module';
import { EventsController } from './events.controller';

@Module({
  imports: [
    LocationsModule,
    MongooseModule.forFeature([{name: Event.name, schema: EventSchema}]),
  ],
  providers: [EventsResolver, EventsService],
  controllers: [EventsController],
})
export class EventsModule {}
