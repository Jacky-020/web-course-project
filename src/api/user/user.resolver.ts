import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User, UserDocument } from './user.schema';

@Resolver(() => User)
export class UserResolver {
    constructor(private readonly userService: UserService) {}
    @Query(() => User)
    async user(@Args('username', {type: () => String}) username: string) {
        return (await this.userService.getFromUsername(username));
    }
    @Query(() => [User])
    async users() {
        return this.userService.findAll();
    }
    @ResolveField()
    async comments(@Parent() user: UserDocument) {
        await user.populate('comments');
        return user.comments;
    }
    @ResolveField()
    async favouriteLocations(@Parent() user: UserDocument) {
        await user.populate('favouriteLocations');
        return user.favouriteLocations;
    }
    @ResolveField()
    async favouriteEvents(@Parent() user: UserDocument) {
        await user.populate('favouriteEvents')
        return user.favouriteEvents;
    }
}
