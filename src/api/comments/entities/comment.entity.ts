import { ObjectType, Field, Int, ID, createUnionType, registerEnumType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Event } from 'src/api/events/entities/event.entity';
import { User } from 'src/api/user/user.schema';
import mongoose from 'mongoose'
import { ObjectIDResolver } from 'graphql-scalars';
import { Location } from 'src/api/locations/entities/location.entity';

export const CommentTargetType = createUnionType({
  name: "CommentTargetType",
  types: () => [Location, Event] as const,
  resolveType(val) {
    // Kind of a hack
    if (val.en_name) {
      return Location;
    } else {
      return Event;
    }
  }
});

export enum CommentTargetTypes {
  LOCATION = "Location",
  EVENT = "Event",
}

registerEnumType(CommentTargetTypes, {
  name: "CommentTargetTypes",
})

@ObjectType()
@Schema()
export class Comment {
  /**
   * ID of the comment
   */
  @Field(() => ObjectIDResolver)
  _id: mongoose.Schema.Types.ObjectId;
  /**
   * Commented user
   */
  @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'User'})
  @Field(() => User)
  user: User;

  @Prop({type: String}) // enum: CommentTargetTypes
  @Field(() => CommentTargetTypes)
  targetType: CommentTargetTypes;

  /**
   * Target of the comment, either Location / Event
   */
  @Field(() => CommentTargetType)
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'targetType',
  })
  target: Event | Location;
  
  /**
   * Body of the comment
   */
  @Prop()
  body: string;
  /**
   * Datetime where the comment is first posted
   */
  @Prop()
  post_date: Date;
  /**
   * Datetime where the comment is last updated
   */
  @Prop()
  last_update: Date;
  /**
   * Users that liked the comment
   */
  @Prop({type: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}]})
  @Field(() => [User])
  likes: User[];
}

export const CommentSchema = SchemaFactory.createForClass(Comment);


