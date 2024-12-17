import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateCommentInput {
  @Field(() => Int, { description: 'Event ID' })
  event_id: number;
  @Field(() => String, { description: 'Comment body'})
  comment: string;
}
