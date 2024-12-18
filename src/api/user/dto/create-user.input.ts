import { InputType, Field } from '@nestjs/graphql';
import { Role } from '../user.schema';
import { IsAlphanumeric, IsAscii, IsEmail } from "class-validator";

@InputType()
export class CreateUserInput {
    /**
     * username of the user
     */
    @IsAlphanumeric()
    username: string;

    /**
     * email of the user
     */
    @IsEmail({
        require_tld: false,
    })
    email: string;

    /**
     * password of the user
     */
    @IsAscii()
    password: string;

    /**
     * roles of the user [user, admin]
     */
    @Field(() => [Role])
    roles: Role[];
}
