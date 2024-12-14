import { ObjectType, Field, Int, Float } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from "mongoose"

export type LocationDocument = HydratedDocument<Location>

@ObjectType()
@Schema()
export class Location {
  @Field(() => Int, { description: 'Venue id, used by LCSD' })
  @Prop({unique: true, required: true, index: true})
  id: number;

  @Field(() => String, {description: "Chinese name of the venue"})
  @Prop()
  chi_name: string;

  @Field(() => String, {description: "English name of the venue"})
  @Prop()
  en_name: string;

  @Field(() => Float, {description: "Latitude of the venue", nullable: true})
  @Prop()
  latitude?: number;

  @Field(() => Float, {description: "Longitude of the venue", nullable: true})
  @Prop()
  longitude?: number;
}

export const LocationSchema = SchemaFactory.createForClass(Location);
