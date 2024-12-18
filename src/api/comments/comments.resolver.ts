import { Resolver, Query, Mutation, Args, Int, GqlExecutionContext, ID, Info } from '@nestjs/graphql';
import { CommentsService } from './comments.service';
import { Comment } from './entities/comment.entity';
import { CreateEventCommentInput, CreateLocationCommentInput } from './dto/create-comment.input';
import { UpdateCommentInput } from './dto/update-comment.input';
import { ObjectIDResolver } from 'graphql-scalars';
import { LoginUser } from '../auth/auth.service';
import { SessionUser } from '../auth/auth.service';
import { Event } from '../events/entities/event.entity';

@Resolver(() => Comment)
export class CommentsResolver {
  constructor(private readonly commentsService: CommentsService) {}

  @Mutation(() => Comment)
  async createEventComment(
    @Args('createCommentInput') createCommentInput: CreateEventCommentInput,
    @LoginUser() currentUser: SessionUser,
  ): Promise<Comment> {
    const comment = await this.commentsService.createEventComment(createCommentInput, currentUser);
    return comment;
  }

  @Mutation(() => Comment)
  async createLocationComment(
    @Args('createCommentInput') createCommentInput: CreateLocationCommentInput,
    @LoginUser() currentUser: SessionUser,
  ): Promise<Comment> {
    return this.commentsService.createLocationComment(createCommentInput, currentUser);
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
  async likeComment(
    @Args('id', {type: () => ObjectIDResolver}) id: string,
    @LoginUser() user: SessionUser
  ) {
    return this.commentsService.likeComment(id, user.id);
  }

  @Mutation(() => Comment)
  async unlikeComment(
    @Args('id', {type: () => ObjectIDResolver}) id: string,
    @LoginUser() user: SessionUser
  ) {
    return this.commentsService.unlikeComment(id, user.id);
  }

  @Mutation(() => Comment)
  async updateComment(
    @Args('updateCommentInput') updateCommentInput: UpdateCommentInput,
    @LoginUser() user: SessionUser,
  ) {
    return this.commentsService.update(updateCommentInput, user);
  }

  @Mutation(() => Comment)
  async removeComment(@Args('id', { type: () => ObjectIDResolver }) id: string, @LoginUser() user: SessionUser) {
    return this.commentsService.remove(id, user);
  }
}
