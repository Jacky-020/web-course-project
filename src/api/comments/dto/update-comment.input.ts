import { InputType, Field, ID } from '@nestjs/graphql';
import { ObjectIDResolver } from 'graphql-scalars';

@InputType()
export class UpdateCommentInput {
  @Field(() => ObjectIDResolver, {description: "Comment ID"})
  id: string;
  @Field(() => String, {description: "Comment body"})
  comment: string;
}
