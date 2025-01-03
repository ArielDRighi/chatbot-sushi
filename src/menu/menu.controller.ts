import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { MenuService } from './menu.service';
import { MenuItem } from './menu.schema';

@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Get()
  getMenu() {
    return this.menuService.getAllItems();
  }
  @Get(':id')
  getMenuItem(@Param('id') id: string) {
    return this.menuService.getItemById(id);
  }

  @Post()
  createMenuItem(@Body() menuItem: Partial<MenuItem>) {
    return this.menuService.create(menuItem);
  }

  @Put(':id')
  updateMenuItem(@Param('id') id: string, @Body() menuItem: Partial<MenuItem>) {
    return this.menuService.update(id, menuItem);
  }

  @Delete(':id')
  deleteMenuItem(@Param('id') id: string) {
    return this.menuService.delete(id);
  }
}
