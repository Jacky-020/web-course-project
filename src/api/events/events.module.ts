import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsMetaResolver, EventsResolver } from './events.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { Event, EventMeta, EventMetaSchema, EventSchema } from './entities/event.entity';
import { LocationsModule } from '../locations/locations.module';
import { EventsController } from './events.controller';

@Module({
  imports: [
    LocationsModule,
    MongooseModule.forFeature([{name: Event.name, schema: EventSchema}]),
    MongooseModule.forFeature([{name: EventMeta.name, schema: EventMetaSchema}]),
  ],
  providers: [EventsResolver, EventsService, EventsMetaResolver],
  controllers: [EventsController],
})
export class EventsModule {}
