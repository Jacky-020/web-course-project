import { Field, HideField, ObjectType } from "@nestjs/graphql";
import { Prop, SchemaFactory, Schema, Virtual } from "@nestjs/mongoose";
import { IsAlphanumeric, IsAscii, IsEmail } from "class-validator";
import { HydratedDocument } from "mongoose";
import { Comment } from "../comments/entities/comment.entity";
import { Location } from "../locations/entities/location.entity";
import { Event } from "../events/entities/event.entity";

export type UserDocument = HydratedDocument<User>;

export enum Role {
    User = 'user',
    Admin = 'admin',
}

@Schema()
@ObjectType()
export class User {
    @Prop({unique: true, required: true, index: true})
    @IsAlphanumeric()
    @Field()
    username: string;

    @IsEmail({
        require_tld: false,
    })
    @Prop({required: true})
    @Field()
    email: string;

    @Prop({required: true})
    @IsAscii()
    @HideField()
    password: string;

    @Prop({default: ['user']})
    @HideField()
    roles: Role[];

    /**
     * Comments made by the user
     */
    @Virtual({
        options: {
            ref: "Comment",
            localField: "_id",
            foreignField: "user",
        }
    })
    @Field(() => [Comment])
    comments: Comment[];

    /**
     * Favourite location of the user
     */
    @Virtual({
        options: {
            ref: "Location",
            localField: "_id",
            foreignField: "favourited",
        }
    })
    @Field(() => [Location])
    favouriteLocations: Location[];

    /**
     * Favourite events of a user
     */
    @Virtual({
        options: {
            ref: "Event",
            localField: "_id",
            foreignField: "favourited",
        }
    })
    @Field(() => [Event])
    favouriteEvents: Event[];
}

export const UserSchema = SchemaFactory.createForClass(User);
