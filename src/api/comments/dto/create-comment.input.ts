import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateEventCommentInput {
  @Field(() => Int, { description: 'Event ID' })
  event_id: number;
  @Field(() => String, { description: 'Comment body'})
  comment: string;
}

@InputType()
export class CreateLocationCommentInput {
  @Field(() => Int, { description: 'Location ID' })
  location_id: number;
  @Field(() => String, { description: 'Comment body'})
  comment: string;
}
