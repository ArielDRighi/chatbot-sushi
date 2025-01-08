import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MenuItem } from './menu.schema';

@Injectable()
export class MenuService {
  constructor(
    @InjectModel(MenuItem.name) private menuItemModel: Model<MenuItem>,
  ) {}

  async getAllItems(): Promise<MenuItem[]> {
    try {
      return this.menuItemModel.find().exec();
    } catch (error) {
      console.error('Error fetching all menu items:', error);
      throw new Error('Error fetching all menu items. Please try again later.');
    }
  }

  async getItemById(id: string): Promise<MenuItem> {
    try {
      return this.menuItemModel.findById(id).exec();
    } catch (error) {
      console.error(`Error fetching menu item by ID ${id}:`, error);
      throw new Error(
        'Error fetching menu item by ID. Please try again later.',
      );
    }
  }

  async getItemByName(name: string): Promise<MenuItem | null> {
    try {
      const normalizedName = this.normalizeText(name);
      const regex = new RegExp(`^${normalizedName}$`, 'i');
      const items = await this.menuItemModel.find().exec();
      return (
        items.find((item) => this.normalizeText(item.name).match(regex)) || null
      );
    } catch (error) {
      console.error(`Error fetching menu item by name ${name}:`, error);
      throw new Error(
        'Error fetching menu item by name. Please try again later.',
      );
    }
  }

  async getItemsByKeyword(keyword: string): Promise<MenuItem[]> {
    try {
      const regex = new RegExp(keyword, 'i');
      return this.menuItemModel.find({ name: regex }).exec();
    } catch (error) {
      console.error(`Error fetching menu items by keyword ${keyword}:`, error);
      throw new Error(
        'Error fetching menu items by keyword. Please try again later.',
      );
    }
  }

  async create(menuItem: Partial<MenuItem>): Promise<MenuItem> {
    try {
      const newItem = new this.menuItemModel(menuItem);
      return newItem.save();
    } catch (error) {
      console.error('Error creating menu item:', error);
      throw new Error('Error creating menu item. Please try again later.');
    }
  }

  async update(id: string, menuItem: Partial<MenuItem>): Promise<MenuItem> {
    try {
      return this.menuItemModel
        .findByIdAndUpdate(id, menuItem, { new: true })
        .exec();
    } catch (error) {
      console.error(`Error updating menu item with ID ${id}:`, error);
      throw new Error('Error updating menu item. Please try again later.');
    }
  }

  async delete(id: string): Promise<MenuItem> {
    try {
      return this.menuItemModel.findByIdAndDelete(id).exec();
    } catch (error) {
      console.error(`Error deleting menu item with ID ${id}:`, error);
      throw new Error('Error deleting menu item. Please try again later.');
    }
  }

  async deleteAll(): Promise<void> {
    try {
      await this.menuItemModel.deleteMany({}).exec();
    } catch (error) {
      console.error('Error deleting all menu items:', error);
      throw new Error('Error deleting all menu items. Please try again later.');
    }
  }

  private normalizeText(text: string): string {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }
}
