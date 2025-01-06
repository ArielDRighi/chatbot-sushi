import { Model } from 'mongoose';
import { MenuItem } from './menu.schema';
export declare class MenuService {
    private menuItemModel;
    constructor(menuItemModel: Model<MenuItem>);
    getAllItems(): Promise<MenuItem[]>;
    getItemById(id: string): Promise<MenuItem>;
    getItemByName(name: string): Promise<MenuItem | null>;
    getItemsByKeyword(keyword: string): Promise<MenuItem[]>;
    create(menuItem: Partial<MenuItem>): Promise<MenuItem>;
    update(id: string, menuItem: Partial<MenuItem>): Promise<MenuItem>;
    delete(id: string): Promise<MenuItem>;
    deleteAll(): Promise<void>;
}
