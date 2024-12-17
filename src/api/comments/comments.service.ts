import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { CreateCommentInput } from './dto/create-comment.input';
import { UpdateCommentInput } from './dto/update-comment.input';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Comment } from './entities/comment.entity';
import { UserDocument } from '../user/user.schema';
import DOMPurify from 'dompurify';
import { Event } from '../events/entities/event.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<Comment>,
    @InjectModel(Event.name) private eventModel: Model<Event>,
  ) {}
  async create(createCommentInput: CreateCommentInput, user: UserDocument) {
    const nowDate = new Date(Date.now());
    let event = await this.eventModel.findOne({id: createCommentInput.event_id}).exec();
    if (event === null) {
      throw new UnprocessableEntityException("No such event!"); // Note: repackage error for graphql
    }
    const comment = await this.commentModel.create({
      user: user._id,
      event: createCommentInput.event_id,
      body: DOMPurify.sanitize(createCommentInput.comment), // security feature
      post_date: nowDate,
      last_update: nowDate,
      likes: []
    });
    event.comments.push(comment); // no idea how this works, if it automatically resolves to objectid or vice versa
    event.save();
  }

  async findAll() {
    return this.commentModel.find().exec();
  }

  async findOne(id: string) {
    return this.commentModel.findOne({_id: id}).exec();
  }

  async update(
    updateCommentInput: UpdateCommentInput,
    currentUser: UserDocument,
  ) {
    return this.commentModel.findOneAndUpdate(
      {_id: updateCommentInput.id, user: currentUser},
      {body: updateCommentInput.comment},
      { new: true }
    )
  }

  async remove(id: string) {
    return this.commentModel.findOneAndDelete(
      {_id: id}
    );
  }
}
