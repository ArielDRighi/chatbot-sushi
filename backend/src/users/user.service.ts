import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.schema';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/user.dto';
import { UpdateUserDto } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
      const user = new this.userModel({
        ...createUserDto,
        password: hashedPassword,
      });
      return user.save();
    } catch (error) {
      console.error('Error creating user:', error);
      throw new InternalServerErrorException(
        'Error creating user. Please try again later.',
      );
    }
  }

  async findOneByEmail(email: string): Promise<User | null> {
    try {
      const user = await this.userModel.findOne({ email }).exec();
      if (user) {
        console.log('Stored Hashed Password:', user.password);
      }
      return user || null;
    } catch (error) {
      console.error(`Error fetching user by email ${email}:`, error);
      throw new InternalServerErrorException('Error fetching user by email');
    }
  }

  async findOneById(id: string): Promise<User> {
    try {
      const user = await this.userModel.findById(id).exec();
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error(`Error fetching user by ID ${id}:`, error);
      throw new InternalServerErrorException(
        'Error fetching user by ID. Please try again later.',
      );
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    try {
      const updatedUser = await this.userModel
        .findByIdAndUpdate(id, updateUserDto, { new: true })
        .exec();
      if (!updatedUser) {
        throw new NotFoundException('User not found');
      }
      return updatedUser;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error(`Error updating user by ID ${id}:`, error);
      throw new InternalServerErrorException(
        'Error updating user. Please try again later.',
      );
    }
  }

  async delete(id: string): Promise<{ message: string }> {
    try {
      const deletedUser = await this.userModel.findByIdAndDelete(id).exec();
      if (!deletedUser) {
        throw new NotFoundException('User not found');
      }
      return { message: 'User deleted successfully.' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error(`Error deleting user by ID ${id}:`, error);
      throw new InternalServerErrorException(
        'Error deleting user. Please try again later.',
      );
    }
  }

  async getAllUsers(): Promise<User[]> {
    try {
      return await this.userModel.find().exec();
    } catch (error) {
      console.error('Error fetching all users:', error);
      throw new InternalServerErrorException(
        'Error fetching all users. Please try again later.',
      );
    }
  }
}
