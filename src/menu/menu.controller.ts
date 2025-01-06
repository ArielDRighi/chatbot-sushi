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
@UseGuards(JwtAuthGuard, RolesGuard)
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
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Create a new menu item' })
  @ApiResponse({ status: 201, description: 'Menu item created successfully.' })
  @ApiBody({ type: MenuItem })
  createMenuItem(@Body() menuItem: Partial<MenuItem>) {
    return this.menuService.create(menuItem);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update a menu item by ID' })
  @ApiResponse({ status: 200, description: 'Menu item updated successfully.' })
  @ApiParam({ name: 'id', description: 'The ID of the menu item' })
  @ApiBody({ type: MenuItem })
  updateMenuItem(@Param('id') id: string, @Body() menuItem: Partial<MenuItem>) {
    return this.menuService.update(id, menuItem);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete a menu item by ID' })
  @ApiResponse({ status: 200, description: 'Menu item deleted successfully.' })
  @ApiParam({ name: 'id', description: 'The ID of the menu item' })
  deleteMenuItem(@Param('id') id: string) {
    return this.menuService.delete(id);
  }
}
