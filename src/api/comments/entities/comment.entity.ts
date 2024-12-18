import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Event } from 'src/api/events/entities/event.entity';
import { User } from 'src/api/user/user.schema';
import mongoose from 'mongoose'
import { ObjectIDResolver } from 'graphql-scalars';

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
  /**
   * Event that was commented on
   */
  @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'Event'})
  @Field(() => Event)
  event: Event;
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


