import { Resolver, Query, Mutation, Args, Int, GqlExecutionContext, ID, Info } from '@nestjs/graphql';
import { CommentsService } from './comments.service';
import { Comment } from './entities/comment.entity';
import { CreateCommentInput } from './dto/create-comment.input';
import { UpdateCommentInput } from './dto/update-comment.input';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserDocument, UserSession } from '../user/user.schema';
import { ObjectIDResolver } from 'graphql-scalars';

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
  async createComment(
    @Args('createCommentInput') createCommentInput: CreateCommentInput,
    @CurrentUser() currentUser: UserSession,
  ): Promise<Comment> {
    return this.commentsService.create(createCommentInput, currentUser);
  }

  @Query(() => [Comment], { name: 'comments' })
  async findAll() {
    return this.commentsService.findAll();
  }

  @Query(() => Comment, { name: 'comment' })
  async findOne(@Args('id', { type: () => ObjectIDResolver }) id: string) {
    const comment = await this.commentsService.findOne(id);
    return comment;
  }

  @Mutation(() => Comment)
  async updateComment(
    @Args('updateCommentInput') updateCommentInput: UpdateCommentInput,
    @CurrentUser() user: UserDocument,
  ) {
    return this.commentsService.update(updateCommentInput, user);
  }

  @Mutation(() => Comment)
  async removeComment(@Args('id', { type: () => ID }) id: string, @CurrentUser() user: UserSession) { // FIXME: take out typedef
    return this.commentsService.remove(id, user);
  }
}
