import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { MenuService } from './menu.service';
import { MenuItem } from './menu.schema';
import { RolesGuard } from 'auth/roles.guard';
import { Roles } from 'auth/roles.decorator';
import { UserRole } from 'users/user.roles.enum';
import { JwtAuthGuard } from 'auth/jwt-auth.guard';

@Controller('menu')
@UseGuards(JwtAuthGuard, RolesGuard)
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
  @Roles(UserRole.ADMIN)
  createMenuItem(@Body() menuItem: Partial<MenuItem>) {
    return this.menuService.create(menuItem);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN)
  updateMenuItem(@Param('id') id: string, @Body() menuItem: Partial<MenuItem>) {
    return this.menuService.update(id, menuItem);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  deleteMenuItem(@Param('id') id: string) {
    return this.menuService.delete(id);
  }
}
