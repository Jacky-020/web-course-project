import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { EventsService } from './events.service';
import { Event, EventMeta } from './entities/event.entity';
import { CreateEventInput } from './dto/create-event.input';
import { UpdateEventInput } from './dto/update-event.input';
import { Role } from '../user/user.schema';
import { Roles } from '../auth/auth.guard';
import { LoginUser, SessionUser } from '../auth/auth.service';

@Resolver(() => Event)
export class EventsResolver {
  constructor(private readonly eventsService: EventsService) {}

  @Mutation(() => Event)
  @Roles([Role.Admin])
  createEvent(@Args('createEventInput') createEventInput: CreateEventInput) {
    return this.eventsService.create(createEventInput);
  }

  @Query(() => [Event], { name: 'events' })
  findAll() {
    return this.eventsService.findAll();
  }

  @Query(() => Event, { name: 'event' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.eventsService.findOne(id);
  }

  @Query(() => Int, { name: 'eventCount'})
  count() {
    return this.eventsService.count();
  }

  @Mutation(() => Event)
  favouriteEvent(
    @Args('id', { type: () => Int}) id: number,
    @LoginUser() user: SessionUser
  ) {
    return this.eventsService.favouriteEvent(id, user.id);
  }

  @Mutation(() => Event)
  unfavouriteEvent(
    @Args('id', { type: () => Int}) id: number,
    @LoginUser() user: SessionUser
  ) {
    return this.eventsService.unfavouriteEvent(id, user.id);
  }

  @Mutation(() => Event)
  @Roles([Role.Admin])
  updateEvent(@Args('updateEventInput') updateEventInput: UpdateEventInput) {
    return this.eventsService.update(updateEventInput.id, updateEventInput);
  }

  @Mutation(() => Event)
  @Roles([Role.Admin])
  removeEvent(@Args('id', { type: () => Int }) id: number) {
    return this.eventsService.remove(id);
  }
}

@Resolver(() => EventMeta)
export class EventsMetaResolver {
  constructor(private readonly eventsService: EventsService) {}
  @Query(() => EventMeta, {name: 'event_meta'})
  async findOne() {
    return (await this.eventsService.getMeta()) || {};
  }
  
}
