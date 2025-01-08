import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.schema';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  private async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const { password } = createUserDto;
      const hashedPassword = await this.hashPassword(password);
      console.log('Hashed Password during creation:', hashedPassword); // Agrega este log
      const user = new this.userModel({
        ...createUserDto,
        password: hashedPassword,
      });
      return user.save();
    } catch (error) {
      console.error('Error creating user:', error);
      throw new Error('Error creating user. Please try again later.');
    }
  }

  async findOneByEmail(email: string): Promise<User | null> {
    try {
      const user = await this.userModel.findOne({ email }).exec();
      if (user) {
        console.log('Stored Hashed Password:', user.password); // Agrega este log
      }
      return user || null; // Si no se encuentra el usuario, retornamos null.
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
      console.error(`Error fetching user by ID ${id}:`, error);
      throw new Error('Error fetching user by ID. Please try again later.');
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    try {
      if (updateUserDto.password) {
        updateUserDto.password = await this.hashPassword(
          updateUserDto.password,
        );
      }
      return this.userModel
        .findByIdAndUpdate(id, updateUserDto, { new: true })
        .exec();
    } catch (error) {
      console.error(`Error updating user with ID ${id}:`, error);
      throw new Error('Error updating user. Please try again later.');
    }
  }

  async delete(id: string): Promise<{ message: string }> {
    try {
      const deletedUser = await this.userModel.findByIdAndDelete(id).exec();
      if (!deletedUser) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      return { message: 'User deleted successfully.' };
    } catch (error) {
      console.error(`Error deleting user with ID ${id}:`, error);
      throw new Error('Error deleting user. Please try again later.');
    }
  }

  async getAllUsers(): Promise<User[]> {
    try {
      return this.userModel.find().exec();
    } catch (error) {
      console.error('Error fetching all users:', error);
      throw new Error('Error fetching all users. Please try again later.');
    }
  }
}
