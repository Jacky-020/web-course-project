import { Field, HideField, ObjectType } from "@nestjs/graphql";
import { OmitType } from "@nestjs/mapped-types";
import { Prop, SchemaFactory, Schema } from "@nestjs/mongoose";
import { IsAlphanumeric, IsAscii, IsEmail } from "class-validator";
import { HydratedDocument } from "mongoose";

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
}

export class UserSession extends OmitType(User, ['password'] as const) {
    id: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
