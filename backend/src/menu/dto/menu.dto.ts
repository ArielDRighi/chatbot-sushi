import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsBoolean } from 'class-validator';

export class MenuDto {
  @ApiProperty({
    example: 'Sushi de Salmón',
    description: 'The name of the menu item',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'Delicious salmon sushi',
    description: 'The description of the menu item',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 10.99, description: 'The price of the menu item' })
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @ApiProperty({ example: true, description: 'Availability of the menu item' })
  @IsBoolean()
  @IsNotEmpty()
  available: boolean;
}
