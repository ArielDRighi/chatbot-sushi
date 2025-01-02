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
}
