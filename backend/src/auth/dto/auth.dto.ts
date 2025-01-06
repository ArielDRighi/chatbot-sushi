import { ApiProperty } from '@nestjs/swagger';

export class SignUpDto {
  @ApiProperty({ example: 'John Doe', description: 'The name of the user' })
  name: string;

  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'The email of the user',
  })
  email: string;

  @ApiProperty({
    example: 'password123',
    description: 'The password of the user',
  })
  password: string;
}

export class SignInDto {
  @ApiProperty({
    example: 'admin@example.com',
    description: 'The email of the user',
  })
  email: string;

  @ApiProperty({
    example: 'admin123',
    description: 'The password of the user',
  })
  password: string;
}
