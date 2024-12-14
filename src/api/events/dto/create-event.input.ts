import { InputType, Int, Field } from '@nestjs/graphql';
import { CreateLocationInput } from 'src/api/locations/dto/create-location.input';
import { Location } from 'src/api/locations/entities/location.entity';

@InputType()
export class CreateEventInput {
  /**
   * ID of the event, used by LCSD
   */
  id: number;

  /**
   * Title of the event in Chinese.
   */
  chi_title: string;

  /**
   * Title of the event in English.
   */
  en_title: string;

  /**
   * First layer catagory. [LCSD]
   */
  cat1: string;

  /**
   * Second layer catagory. [LCSD]
   */
  cat2: string;

  // Datetime string is not in proper format

  /**
   * Datetime of the event (Chinese)
   */
  date_c: string;

  /**
   * Datetime of the event (English)
   */
  date_e: string;

  /**
   * Datetime of the event
   */
  date?: Date;

  /**
   * Duration string of the event (Chinese)
   */
  duration_c: string;

  /**
   * Duration string of the event (English)
   */
  duration_e: string;

  /**
   * Duration of the event, in minutes
   */
  @Field(() => Int)
  duration?: number;

  /**
   * The location/venue of the event
   */
  @Field(() => CreateLocationInput)
  venue?: Location;

  /**
   * Age limit warning of the event (Chinese)
   */
  agelimit_c: string;

  /**
   * Age limit warning of the event (English)
   */
  agelimit_e: string;

  /**
   * Price message of the event (Chinese)
   */
  price_c: string;

  /**
   * Price message of the event (English)
   */
  price_e: string;

  /**
   * Description of the event (Chinese)
   */
  desc_c: string;

  /**
   * Description of the event (English)
   */
  desc_e: string;

  /**
   * URL of the event (Chinese)
   */
  url_c: string;

  /**
   * URL of the event (English)
   */
  url_e: string;

  /**
   * Ticketing agent URL of the event (Chinese)
   */
  ticket_agent_url_c: string;

  /**
   * Ticketing agent URL of the event (English)
   */
  ticket_agent_url_e: string;

  /**
   * Remarks (Chinese)
   */
  remarks_c: string;

  /**
   * Remarks (English)
   */
  remarks_e: string;

  /**
   * Enquiry telephone number
   */
  tel: string;

  /**
   * Fax number
   */
  fax: string;

  /**
   * Email
   */
  email: string;

  /**
   * Date when tickets go on sale
   */
  sale_date: Date;

  /**
   * Whether there is online ticketing available
   * [LCSD: interbook]
   */
  online_ticketing: boolean;

  /**
   * The presenter of the event (Chinese)
   */
  presenter_c: string;

  /**
   * The presenter of the event (English)
   */
  presenter_e: string;

  /**
   * Datetime when the event is created.
   */
  date_created: Date;
}

