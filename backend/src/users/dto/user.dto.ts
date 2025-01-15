import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../user.roles.enum';
import {
  IsNotEmpty,
  IsEnum,
  IsEmail,
  IsString,
  MinLength,
  IsOptional,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'John Doe', description: 'The name of the user' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'The email of the user',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'password123',
    description: 'The password of the user',
  })
  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    example: UserRole.CUSTOMER,
    description: 'The role of the user',
  })
  @IsEnum(UserRole)
  @IsNotEmpty()
  role: UserRole;
}

export class UpdateUserDto {
  @ApiProperty({
    example: 'John Doe',
    description: 'The name of the user',
    required: false,
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'The email of the user',
    required: false,
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({
    example: 'password123',
    description: 'The password of the user',
    required: false,
  })
  @IsString()
  @MinLength(6)
  @IsOptional()
  password?: string;

  @ApiProperty({
    example: UserRole.CUSTOMER,
    description: 'The role of the user',
    required: false,
  })
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;
}
