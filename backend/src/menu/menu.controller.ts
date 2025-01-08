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
import { UserRole } from 'users/user.roles.enum';

import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('menu')
@ApiBearerAuth()
@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Get()
  @ApiOperation({ summary: 'Get all menu items' })
  @ApiResponse({ status: 200, description: 'Return all menu items.' })
  getMenu() {
    return this.menuService.getAllItems();
  }
  @Get(':id')
  @ApiOperation({ summary: 'Get a menu item by ID' })
  @ApiResponse({ status: 200, description: 'Return a menu item.' })
  @ApiParam({ name: 'id', description: 'The ID of the menu item' })
  getMenuItem(@Param('id') id: string) {
    return this.menuService.getItemById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new menu item' })
  @ApiResponse({ status: 201, description: 'Menu item created successfully.' })
  @ApiBody({ type: MenuItem })
  createMenuItem(@Body() menuItem: Partial<MenuItem>) {
    return this.menuService.create(menuItem);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a menu item by ID' })
  @ApiResponse({ status: 200, description: 'Menu item updated successfully.' })
  @ApiParam({ name: 'id', description: 'The ID of the menu item' })
  @ApiBody({ type: MenuItem })
  updateMenuItem(@Param('id') id: string, @Body() menuItem: Partial<MenuItem>) {
    return this.menuService.update(id, menuItem);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a menu item by ID' })
  @ApiResponse({ status: 200, description: 'Menu item deleted successfully.' })
  @ApiParam({ name: 'id', description: 'The ID of the menu item' })
  deleteMenuItem(@Param('id') id: string) {
    return this.menuService.delete(id);
  }
}
