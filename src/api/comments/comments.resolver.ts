import { Resolver, Query, Mutation, Args, Int, GqlExecutionContext, ID } from '@nestjs/graphql';
import { CommentsService } from './comments.service';
import { Comment } from './entities/comment.entity';
import { CreateCommentInput } from './dto/create-comment.input';
import { UpdateCommentInput } from './dto/update-comment.input';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserDocument } from '../user/user.schema';

// FIXME: Move to elsewhere if needed
export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest() || GqlExecutionContext.create(ctx).getContext().req;
    return req.user;
  }
);

@Resolver(() => Comment)
export class CommentsResolver {
  constructor(private readonly commentsService: CommentsService) {}

  @Mutation(() => Comment)
  createComment(
    @Args('createCommentInput') createCommentInput: CreateCommentInput,
    @CurrentUser() currentUser: UserDocument,
  ) {
    return this.commentsService.create(createCommentInput, currentUser);
  }

  @Query(() => [Comment], { name: 'comments' })
  findAll() {
    return this.commentsService.findAll();
  }

  @Query(() => Comment, { name: 'comment' })
  findOne(@Args('id', { type: () => ID }) id: string) {
    return this.commentsService.findOne(id);
  }

  @Mutation(() => Comment)
  updateComment(
    @Args('updateCommentInput') updateCommentInput: UpdateCommentInput,
    @CurrentUser() user: UserDocument,
  ) {
    return this.commentsService.update(updateCommentInput, user);
  }

  @Mutation(() => Comment)
  removeComment(@Args('id', { type: () => ID }) id: string) {
    return this.commentsService.remove(id);
  }
}
