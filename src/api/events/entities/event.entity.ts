import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Location } from 'src/api/locations/entities/location.entity';
import mongoose from 'mongoose';
import { Comment } from 'src/api/comments/entities/comment.entity';
import { User } from 'src/api/user/user.schema';

@ObjectType()
@Schema()
export class Event {
  /**
   * ID of the event, used by LCSD
   */
  @Prop({unique: true, index: true})
  id: number;

  /**
   * Title of the event in Chinese.
   */
  @Prop()
  chi_title: string;

  /**
   * Title of the event in English.
   */
  @Prop()
  en_title: string;

  /**
   * First layer catagory. [LCSD]
   */
  @Prop()
  cat1: string;

  /**
   * Second layer catagory. [LCSD]
   */
  @Prop()
  cat2: string;

  // Datetime string is not in proper format

  /**
   * Datetime of the event (Chinese)
   */
  @Prop()
  date_c: string;

  /**
   * Datetime of the event (English)
   */
  @Prop()
  date_e: string;

  /**
   * Datetime of the event
   */
  @Prop()
  date: Date;

  /**
   * Duration string of the event (Chinese)
   */
  @Prop()
  duration_c: string;

  /**
   * Duration string of the event (English)
   */
  @Prop()
  duration_e: string;

  /**
   * Duration of the event, in minutes
   */
  @Prop()
  @Field(() => Int)
  duration?: number;

  /**
   * The location/venue of the event
   */
  @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'Location' })
  @Field(() => Location)
  venue?: Location;

  /**
   * Age limit warning of the event (Chinese)
   */
  @Prop()
  agelimit_c: string;

  /**
   * Age limit warning of the event (English)
   */
  @Prop()
  agelimit_e: string;

  /**
   * Price message of the event (Chinese)
   */
  @Prop()
  price_c: string;

  /**
   * Price message of the event (English)
   */
  @Prop()
  price_e: string;

  /**
   * Description of the event (Chinese)
   */
  @Prop()
  desc_c: string;

  /**
   * Description of the event (English)
   */
  @Prop()
  desc_e: string;

  /**
   * URL of the event (Chinese)
   */
  @Prop()
  url_c: string;

  /**
   * URL of the event (English)
   */
  @Prop()
  url_e: string;

  /**
   * Ticketing agent URL of the event (Chinese)
   */
  @Prop()
  ticket_agent_url_c: string;

  /**
   * Ticketing agent URL of the event (English)
   */
  @Prop()
  ticket_agent_url_e: string;

  /**
   * Remarks (Chinese)
   */
  @Prop()
  remarks_c: string;

  /**
   * Remarks (English)
   */
  @Prop()
  remarks_e: string;

  /**
   * Enquiry telephone number
   */
  @Prop()
  tel: string;

  /**
   * Fax number
   */
  @Prop()
  fax: string;

  /**
   * Email
   */
  @Prop()
  email: string;

  /**
   * Date when tickets go on sale
   */
  @Prop()
  sale_date?: Date;

  /**
   * Whether there is online ticketing available
   * [LCSD: interbook]
   */
  @Prop()
  online_ticketing: boolean;

  /**
   * The presenter of the event (Chinese)
   */
  @Prop()
  presenter_c: string;

  /**
   * The presenter of the event (English)
   */
  @Prop()
  presenter_e: string;

  /**
   * Datetime when the event is created.
   */
  @Prop()
  date_created: Date;

  /**
   * Users that favourited this event
   */
  @Prop({type: [mongoose.Schema.Types.ObjectId], ref: User.name})
  @Field(() => [User])
  favourited: User[];

  /**
   * Comments for the event
   */
  @Prop({type: [mongoose.Schema.Types.ObjectId], ref: "Comment"})
  @Field(() => [Comment])
  comments: Comment[];
}

export const EventSchema = SchemaFactory.createForClass(Event);

@ObjectType()
@Schema()
export class EventMeta {
  /**
   * Hash of the data fetched from source
   */
  @Prop()
  data_hash?: string;
  /**
   * Datetime of last update from source
   */
  @Prop()
  last_update?: Date;
}

export const EventMetaSchema = SchemaFactory.createForClass(EventMeta);
