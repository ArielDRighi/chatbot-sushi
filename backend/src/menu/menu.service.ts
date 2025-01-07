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

  async getItemByName(name: string): Promise<MenuItem | null> {
    const normalizedName = this.normalizeText(name);
    const regex = new RegExp(`^${normalizedName}$`, 'i'); // 'i' para hacer la búsqueda insensible a mayúsculas
    const items = await this.menuItemModel.find().exec();
    return (
      items.find((item) => this.normalizeText(item.name).match(regex)) || null
    );
  }

  async getItemsByKeyword(keyword: string): Promise<MenuItem[]> {
    const regex = new RegExp(keyword, 'i'); // 'i' para hacer la búsqueda insensible a mayúsculas
    return this.menuItemModel.find({ name: regex }).exec();
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

  async deleteAll(): Promise<void> {
    await this.menuItemModel.deleteMany({}).exec();
  }

  private normalizeText(text: string): string {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, ''); // Eliminar tildes
  }
}
