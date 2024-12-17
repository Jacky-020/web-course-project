import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UserService } from './user.service';
import { Role } from '../user/user.schema';
import { Roles } from '../auth/auth.guard';
import { User } from '../user/user.schema';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';

@Resolver(() => User)
export class UserResolver {
    constructor(private readonly userService: UserService) {}

    @Mutation(() => User)
    @Roles([Role.Admin])
    createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
        return this.userService.create(createUserInput);
    }

    @Query(() => [User], { name: 'users' })
    @Roles([Role.Admin])
    findAll() {
        return this.userService.findAll();
    }

    @Query(() => User, { name: 'user' })
    @Roles([Role.Admin])
    findOne(@Args('id', { type: () => String }) id: string) {
        return this.userService.findOne(id);
    }

    @Mutation(() => User)
    @Roles([Role.Admin])
    updateUser(@Args('updateUserInput') updateUserInput: UpdateUserInput) {
        return this.userService.update(updateUserInput.id, updateUserInput);
    }

    @Mutation(() => User)
    @Roles([Role.Admin])
    removeUser(@Args('id', { type: () => String }) id: string) {
        return this.userService.remove(id);
    }
}
