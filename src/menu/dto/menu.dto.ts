import { ApiProperty } from '@nestjs/swagger';

export class MenuDto {
  @ApiProperty({
    example: 'Sushi de Salmón',
    description: 'The name of the menu item',
  })
  name: string;

  @ApiProperty({
    example: 'Delicious salmon sushi',
    description: 'The description of the menu item',
  })
  description: string;

  @ApiProperty({ example: 10.99, description: 'The price of the menu item' })
  price: number;

  @ApiProperty({ example: true, description: 'Availability of the menu item' })
  available: boolean;
}
