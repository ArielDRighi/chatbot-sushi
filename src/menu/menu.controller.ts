import { Controller, Get, Param } from '@nestjs/common';
import { MenuService } from './menu.service';

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
}
