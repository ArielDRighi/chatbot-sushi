import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, UpdateUserDto } from './user.dto';
import { RolesGuard } from 'auth/roles.guard';
import { Roles } from 'auth/roles.decorator';
import { UserRole } from './user.roles.enum';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  //@Roles(UserRole.ADMIN)
  async getAll() {
    return this.userService.getAllUsers();
  }

  @Get(':id')
  @Roles(UserRole.ADMIN)
  async getOne(@Param('id') id: string) {
    return this.userService.findByEmail(id);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN)
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  async delete(@Param('id') id: string) {
    return this.userService.delete(id);
  }
}
