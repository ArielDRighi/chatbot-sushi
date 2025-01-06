import { MenuService } from './menu.service';
import { MenuItem } from './menu.schema';
export declare class MenuController {
    private readonly menuService;
    constructor(menuService: MenuService);
    getMenu(): Promise<MenuItem[]>;
    getMenuItem(id: string): Promise<MenuItem>;
    createMenuItem(menuItem: Partial<MenuItem>): Promise<MenuItem>;
    updateMenuItem(id: string, menuItem: Partial<MenuItem>): Promise<MenuItem>;
    deleteMenuItem(id: string): Promise<MenuItem>;
}
