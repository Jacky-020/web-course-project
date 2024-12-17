import { InputType, Field, ID } from '@nestjs/graphql';

@InputType()
export class UpdateCommentInput {
  @Field(() => ID, {description: "Comment ID"})
  id: string;
  @Field(() => String, {description: "Comment body"})
  comment: string;
}
