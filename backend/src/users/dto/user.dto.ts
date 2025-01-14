import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../user.roles.enum';
import { IsNotEmpty, IsEnum, IsEmail } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'John Doe', description: 'The name of the user' })
  name: string;

  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'The email of the user',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'password123',
    description: 'The password of the user',
  })
  password: string;

  @ApiProperty({
    example: UserRole.CUSTOMER,
    description: 'The role of the user',
  })
  role: UserRole;
}

export class UpdateUserDto {
  @ApiProperty({
    example: 'John Doe',
    description: 'The name of the user',
    required: false,
  })
  name?: string;

  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'The email of the user',
    required: false,
  })
  @IsEmail()
  email?: string;

  @ApiProperty({
    example: 'password123',
    description: 'The password of the user',
    required: false,
  })
  password?: string;

  @ApiProperty({
    example: UserRole.CUSTOMER,
    description: 'The role of the user',
    required: false,
  })
  @IsNotEmpty()
  @IsEnum(UserRole)
  role?: UserRole;
}
