import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { CreateEventCommentInput, CreateLocationCommentInput } from './dto/create-comment.input';
import { UpdateCommentInput } from './dto/update-comment.input';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Comment, CommentTargetTypes } from './entities/comment.entity';
import { Role } from '../user/user.schema';
import DOMPurify from 'isomorphic-dompurify';
import { Event } from '../events/entities/event.entity';
import { SessionUser } from '../auth/auth.service';
import { LocationsService } from '../locations/locations.service';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<Comment>,
    @InjectModel(Event.name) private eventModel: Model<Event>,
    private locationService: LocationsService,
  ) {}

  async createEventComment(createCommentInput: CreateEventCommentInput, userSession: SessionUser): Promise<Comment> {
    let event = await this.eventModel.findOne({ id: createCommentInput.event_id }).exec();
    if (event === null) {
      throw new UnprocessableEntityException("No such event!"); // FIXME: repackage error for graphql
    }
    const comment = await this.createComment(event._id, createCommentInput.comment, userSession.id, CommentTargetTypes.EVENT);
    event.comments.push(comment); // no idea how this works, if it automatically resolves to objectid or vice versa <-- edit: seems like it does
    event.save();
    return comment;
  }

  async createLocationComment(createCommentInput: CreateLocationCommentInput, userSession: SessionUser): Promise<Comment> {
    let loc = await this.locationService.findOne(createCommentInput.location_id);
    if (loc === null) {
      throw new UnprocessableEntityException("No such location!"); // FIXME: repackage error for graphql
    }
    return this.createComment(loc._id, createCommentInput.comment, userSession.id, CommentTargetTypes.LOCATION)
  }

  async createComment(target_id: Types.ObjectId, body: string, user_id: string, targetType: CommentTargetTypes) {
    const nowDate = new Date(Date.now());
    const new_comment = await this.commentModel.create({
      user: user_id,
      targetType: targetType,
      target: target_id,
      body: DOMPurify.sanitize(body), // security feature
      post_date: nowDate,
      last_update: nowDate,
      likes: []
    });
    return this.commentModel.findById(new_comment._id, null, { populate: ['user', 'target', 'likes'] }).exec(); // FIXME: might be inefficient but anyways
  }

  async findAll() {
    return this.commentModel.find(null, null, { populate: ['user', 'target', 'likes'] }).exec();
  }

  async findOne(id: string) {
    return this.commentModel.findById(id, null, { populate: ['user', 'target', 'likes'] }).exec();
  }

  async likeComment(id: string, user_id: string) {
    return this.commentModel.findByIdAndUpdate(id, {$addToSet: {likes: user_id}}, {populate: ['user', 'target', 'likes'], new: true}).exec();
  }

  async unlikeComment(id: string, user_id: string) {
    return this.commentModel.findByIdAndUpdate(id, {$pull: {likes: user_id}}, {populate: ['user', 'target', 'likes'], new: true}).exec();
  }

  async update(
    updateCommentInput: UpdateCommentInput,
    currentUser: SessionUser,
  ) {
    // Feature: admins can delete comments but not change a comment
    // (Of course, if you don't go into the db and update yourself)
    return this.commentModel.findOneAndUpdate(
      { _id: updateCommentInput.id, user: currentUser },
      { body: updateCommentInput.comment, last_update: new Date(Date.now()) },
      { new: true }
    )
  }

  async remove(id: string, currentUser: SessionUser) {
    // FIXME: Populating the user field instead of comparing ObjectID is kind of inefficient,
    // but I don't have a way to be typescript compliant
    const comment = await this.commentModel.findById(id, null, {populate: ['user']}).exec();
    if (comment.user.username === currentUser.username || Role.Admin in currentUser.roles) {
      comment.deleteOne().exec();
    }
    return comment;
  }
}
