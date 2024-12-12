import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { User, UserDocument } from './user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { hash } from 'bcrypt'

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}
  async create(user: User) {
    user.password = await hash(user.password, 10);
    const curUser = await this.getFromUsername(user.username);
    if (curUser != null) {
      throw new UnprocessableEntityException('The user already exists!');
    }
    const createdUser = new this.userModel(user);
    return createdUser.save();
  }
  async getFromUsername(username: string): Promise<UserDocument | null> {
    return this.userModel.findOne({username: username}).exec();
  }
  async getFromId(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(id).exec();
  }
}
