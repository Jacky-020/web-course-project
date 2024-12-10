import { Prop, SchemaFactory, Schema } from "@nestjs/mongoose";
import { IsAlphanumeric, IsAscii, IsEmail } from "class-validator";
import { HydratedDocument } from "mongoose";

export type UserDocument = HydratedDocument<User>;

export enum Role {
    User = 'user',
    Admin = 'admin',
}

@Schema()
export class User {
    @Prop({unique: true, required: true, index: true})
    @IsAlphanumeric()
    username: string;

    @IsEmail()
    @Prop({required: true})
    email: string;

    @Prop({required: true})
    @IsAscii()
    password: string;

    @Prop({default: ['user']})
    roles: Role[];
}

export const UserSchema = SchemaFactory.createForClass(User);
