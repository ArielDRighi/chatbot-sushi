import { NotFoundException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { TestingModule, Test } from '@nestjs/testing';
import { Model } from 'mongoose';
import { MenuItem } from './menu.schema';
import { MenuService } from './menu.service';

describe('MenuService', () => {
  let service: MenuService;
  let model: Model<MenuItem>;
  let mockMenuItemModel: any;

  beforeEach(async () => {
    mockMenuItemModel = {
      find: jest.fn().mockReturnThis(),
      findById: jest.fn().mockReturnThis(),
      findByIdAndUpdate: jest.fn().mockReturnThis(),
      findByIdAndDelete: jest.fn().mockReturnThis(),
      deleteMany: jest.fn().mockReturnThis(),
      exec: jest.fn(),
      save: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MenuService,
        {
          provide: getModelToken(MenuItem.name),
          useValue: mockMenuItemModel,
        },
      ],
    }).compile();

    service = module.get<MenuService>(MenuService);
  });

  describe('getAllItems', () => {
    it('should return an array of menu items', async () => {
      const result = [{ name: 'Test Item' }];
      jest.spyOn(mockMenuItemModel, 'exec').mockResolvedValue(result);
      expect(await service.getAllItems()).toBe(result);
    });
  });

  describe('create', () => {
    it('should throw an error if there is an issue creating the menu item', async () => {
      jest.spyOn(mockMenuItemModel, 'save').mockImplementation(() => {
        throw new Error();
      });
      await expect(service.create({ name: 'Test Item' })).rejects.toThrow();
    });
  });

  describe('update', () => {
    it('should update a menu item by ID', async () => {
      const result = { name: 'Updated Item' };
      jest.spyOn(mockMenuItemModel, 'exec').mockResolvedValue(result);
      expect(await service.update('1', { name: 'Updated Item' })).toBe(result);
    });

    it('should throw an error if there is an issue updating the menu item', async () => {
      jest.spyOn(mockMenuItemModel, 'exec').mockImplementation(() => {
        throw new Error();
      });
      await expect(
        service.update('1', { name: 'Updated Item' }),
      ).rejects.toThrow();
    });
  });

  describe('delete', () => {
    it('should delete a menu item by ID', async () => {
      const result = { name: 'Deleted Item' };
      jest.spyOn(mockMenuItemModel, 'exec').mockResolvedValue(result);
      expect(await service.delete('1')).toBe(result);
    });

    it('should throw an error if there is an issue deleting the menu item', async () => {
      jest.spyOn(mockMenuItemModel, 'exec').mockImplementation(() => {
        throw new Error();
      });
      await expect(service.delete('1')).rejects.toThrow();
    });
  });
});
