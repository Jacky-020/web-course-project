import { Injectable, OnApplicationBootstrap, UnprocessableEntityException } from '@nestjs/common';
import { User, UserDocument } from './user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { hash } from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { homies } from './user.sample';
import { UpdateUserInput } from './dto/update-user.input';

@Injectable()
export class UserService implements OnApplicationBootstrap{
  constructor(@InjectModel(User.name) private userModel: Model<User>, private configService: ConfigService) {}
  async onApplicationBootstrap() {
    // create users for demo / testing purposes
    const cleanUsers = this.configService.get<string>('CLEAN_USERS', "0");
    if (cleanUsers === "1") {
      await this.userModel.deleteMany().exec();
      homies.forEach(homie => this.create(homie));
    }
  }
  async create(user: User) {
    const curUser = await this.getFromUsername(user.username);
    if (curUser != null) {
      throw new UnprocessableEntityException('The user already exists!');
    }
    user.password = await hash(user.password, 10);
    const createdUser = new this.userModel(user);
    return createdUser.save();
  }
  async getFromUsername(username: string): Promise<UserDocument | null> {
    return this.userModel.findOne({username: username}).exec();
  }
  async getFromId(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(id).exec();
  }
  
  async findAll() {
    return this.userModel.find().exec();
  }

  async findOne(id: string) {
    return this.userModel.findById(id).exec();
  }

  async update(id: string, updateUserInput: UpdateUserInput) {
    if(updateUserInput.password) updateUserInput.password = await hash(updateUserInput.password, 10);
    
    return this.userModel.findByIdAndUpdate(id, updateUserInput).exec();
  }

  async remove(id: string) {
    return this.userModel.findByIdAndDelete(id).exec();
  }
}
