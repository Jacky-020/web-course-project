import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UserService } from './user.service';
import { Role } from '../user/user.schema';
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
        return this.userService.create(createUserInput);
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
}
