import { Module } from '@nestjs/common';
import { LocationsService } from './locations.service';
import { LocationsResolver } from './locations.resolver';
import { LocationsController } from './locations.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Location, LocationSchema } from './entities/location.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{name: Location.name, schema: LocationSchema}])
  ],
  providers: [LocationsResolver, LocationsService],
  controllers: [LocationsController],
  exports: [
    MongooseModule.forFeature([{name: Location.name, schema: LocationSchema}]),
    LocationsService,
  ]
})
export class LocationsModule {}
