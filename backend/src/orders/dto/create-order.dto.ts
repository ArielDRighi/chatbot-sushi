import {
  IsString,
  IsArray,
  IsNumber,
  IsOptional,
  ValidateNested,
  IsDate,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class OrderItemDto {
  @ApiProperty({
    example: '60d21b4667d0d8992e610c85',
    description: 'The ID of the product',
  })
  @IsString()
  productId: string;

  @ApiProperty({ example: 2, description: 'The quantity of the product' })
  @IsNumber()
  quantity: number;
}

export class CreateOrderDto {
  @ApiProperty({
    example: 'Juan Pérez',
    description: 'The name of the customer',
  })
  @IsString()
  customerName: string;

  @ApiProperty({ type: [OrderItemDto], description: 'The items in the order' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @ApiProperty({ example: 29.97, description: 'The total price of the order' })
  @IsNumber()
  total: number;

  @ApiProperty({
    example: 'pending',
    description: 'The status of the order',
    required: false,
  })
  @IsString()
  @IsOptional()
  status?: string;

  @ApiProperty({
    example: '2023-10-01T00:00:00.000Z',
    description: 'The creation date of the order',
    required: false,
  })
  @IsDate()
  @IsOptional()
  createdAt?: Date;

  @ApiProperty({
    example: '60d21b4667d0d8992e610c85',
    description: 'The ID of the user',
  })
  @IsString()
  userId: string; // Agregar el ID del usuario
}
