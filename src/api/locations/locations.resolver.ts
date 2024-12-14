import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { LocationsService } from './locations.service';
import { Location } from './entities/location.entity';
import { CreateLocationInput } from './dto/create-location.input';
import { UpdateLocationInput } from './dto/update-location.input';
import { Roles } from '../auth/auth.guard';
import { Role } from '../user/user.schema';

@Resolver(() => Location)
export class LocationsResolver {
  constructor(private readonly locationsService: LocationsService) {}

  @Mutation(() => Location)
  @Roles([Role.Admin])
  createLocation(@Args('createLocationInput') createLocationInput: CreateLocationInput) {
    return this.locationsService.create(createLocationInput);
  }

  @Query(() => [Location], { name: 'locations' })
  findAll() {
    return this.locationsService.findAll();
  }

  @Query(() => Location, { name: 'location' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.locationsService.findOne(id);
  }

  @Mutation(() => Location)
  @Roles([Role.Admin])
  updateLocation(@Args('id', { type: () => Int }) id: number, @Args('updateLocationInput') updateLocationInput: UpdateLocationInput) {
    return this.locationsService.update(id, updateLocationInput);
  }

  @Mutation(() => Location)
  @Roles([Role.Admin])
  removeLocation(@Args('id', { type: () => Int }) id: number) {
    return this.locationsService.remove(id);
  }
}
