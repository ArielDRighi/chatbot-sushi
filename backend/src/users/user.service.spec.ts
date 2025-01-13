import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getModelToken } from '@nestjs/mongoose';
import { User } from './user.schema';
import {
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserRole } from './user.roles.enum';
import { AuthService } from '../auth/auth.service';
import { JwtService } from '@nestjs/jwt';

const mockUserModel = {
  create: jest.fn().mockImplementation((userData) => ({
    ...userData,
    save: jest.fn().mockResolvedValue(userData),
  })),
  findOne: jest.fn(),
  findById: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  findByIdAndDelete: jest.fn(),
  find: jest.fn(),
};

const mockUserInstance = {
  save: jest.fn(),
};

describe('UserService', () => {
  let service: UserService;
  let userModel: any;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        AuthService,
        JwtService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userModel = module.get(getModelToken(User.name));
    authService = module.get<AuthService>(AuthService);
  });

  describe('findOneByEmail', () => {
    it('should return a user by email', async () => {
      const user = { email: 'test@example.com', password: 'hashed_password' };
      userModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(user),
      });

      const result = await service.findOneByEmail('test@example.com');
      expect(userModel.findOne).toHaveBeenCalledWith({
        email: 'test@example.com',
      });
      expect(result).toEqual(user);
    });

    it('should return null if no user is found', async () => {
      userModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      const result = await service.findOneByEmail('test@example.com');
      expect(result).toBeNull();
    });

    it('should throw an error if fetching fails', async () => {
      userModel.findOne.mockReturnValue({
        exec: jest.fn().mockRejectedValue(new Error()),
      });

      await expect(
        service.findOneByEmail('test@example.com'),
      ).rejects.toThrowError(InternalServerErrorException);
    });
  });

  describe('findOneById', () => {
    it('should return a user by ID', async () => {
      const user = { id: '1', email: 'test@example.com' };
      userModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(user),
      });

      const result = await service.findOneById('1');
      expect(userModel.findById).toHaveBeenCalledWith('1');
      expect(result).toEqual(user);
    });

    it('should throw NotFoundException if user not found', async () => {
      userModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.findOneById('1')).rejects.toThrowError(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update a user by ID', async () => {
      const updateUserDto = { email: 'updated@example.com' };
      const updatedUser = { id: '1', ...updateUserDto };

      userModel.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(updatedUser),
      });

      const result = await service.update('1', updateUserDto);
      expect(userModel.findByIdAndUpdate).toHaveBeenCalledWith(
        '1',
        updateUserDto,
        { new: true },
      );
      expect(result).toEqual(updatedUser);
    });

    it('should throw an error if update fails', async () => {
      userModel.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockRejectedValue(new Error('Update failed')),
      });

      await expect(service.update('1', {})).rejects.toThrowError(
        InternalServerErrorException,
      );
    });
  });

  describe('delete', () => {
    it('should delete a user by ID', async () => {
      const deletedUser = { id: '1', email: 'test@example.com' };
      userModel.findByIdAndDelete.mockReturnValue({
        exec: jest.fn().mockResolvedValue(deletedUser),
      });

      const result = await service.delete('1');
      expect(userModel.findByIdAndDelete).toHaveBeenCalledWith('1');
      expect(result).toEqual({ message: 'User deleted successfully.' });
    });

    it('should throw NotFoundException if user not found', async () => {
      userModel.findByIdAndDelete.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.delete('1')).rejects.toThrowError(NotFoundException);
    });
  });

  describe('getAllUsers', () => {
    it('should return all users', async () => {
      const users = [
        { id: '1', email: 'user1@example.com' },
        { id: '2', email: 'user2@example.com' },
      ];
      userModel.find.mockReturnValue({
        exec: jest.fn().mockResolvedValue(users),
      });

      const result = await service.getAllUsers();
      expect(userModel.find).toHaveBeenCalled();
      expect(result).toEqual(users);
    });
  });
});
