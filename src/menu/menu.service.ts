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
    return this.menuItemModel.find().exec();
  }

  async getItemById(id: string): Promise<MenuItem> {
    return this.menuItemModel.findById(id).exec();
  }

  async create(menuItem: Partial<MenuItem>): Promise<MenuItem> {
    const newItem = new this.menuItemModel(menuItem);
    return newItem.save();
  }

  async update(id: string, menuItem: Partial<MenuItem>): Promise<MenuItem> {
    return this.menuItemModel
      .findByIdAndUpdate(id, menuItem, { new: true })
      .exec();
  }

  async delete(id: string): Promise<MenuItem> {
    return this.menuItemModel.findByIdAndDelete(id).exec();
  }
}
