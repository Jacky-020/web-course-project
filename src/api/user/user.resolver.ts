import { Resolver, Query, Mutation, Args, ResolveField, Parent } from '@nestjs/graphql';
import { UserService } from './user.service';
import { Role, User, UserDocument } from '../user/user.schema';
import { Roles } from '../auth/auth.guard';
import { UserType } from '../user/user.schema';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';

@Resolver(() => UserType)
export class UserResolver {
    constructor(private readonly userService: UserService) {}

    @Mutation(() => UserType)
    @Roles([Role.Admin])
    createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
        let newUser: User = {
            ...createUserInput,
            comments: [],
            favouriteEvents: [],
            favouriteLocations: [],
        }
        return this.userService.create(newUser);
    }

    @Query(() => [UserType], { name: 'users' })
    @Roles([Role.Admin])
    findAll() {
        return this.userService.findAll();
    }

    @Query(() => UserType, { name: 'user' })
    @Roles([Role.Admin])
    findOne(@Args('id', { type: () => String }) id: string) {
        return this.userService.findOne(id);
    }

    @Mutation(() => UserType)
    @Roles([Role.Admin])
    updateUser(@Args('updateUserInput') updateUserInput: UpdateUserInput) {
        return this.userService.update(updateUserInput.id, updateUserInput);
    }

    @Mutation(() => UserType)
    @Roles([Role.Admin])
    removeUser(@Args('id', { type: () => String }) id: string) {
        return this.userService.remove(id);
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
