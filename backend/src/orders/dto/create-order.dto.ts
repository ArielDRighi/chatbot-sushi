import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsArray,
  ValidateNested,
  IsOptional,
  IsDateString,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';

class OrderItemDto {
  @ApiProperty({
    example: '60d21b4667d0d8992e610c85',
    description: 'The ID of the product',
  })
  @IsString()
  @IsNotEmpty()
  productId: string;

  @ApiProperty({ example: 2, description: 'The quantity of the product' })
  @IsNotEmpty()
  quantity: number;
}

export class CreateOrderDto {
  @ApiProperty({ example: 'John Doe', description: 'The name of the customer' })
  @IsString()
  @IsNotEmpty()
  customerName: string;

  @ApiProperty({ type: [OrderItemDto], description: 'The items in the order' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @ApiProperty({
    example: 'pending',
    description: 'The status of the order',
    required: false,
  })
  @IsString()
  @IsOptional()
  status?: string;

  @ApiProperty({
    example: '2023-10-01T00:00:00Z',
    description: 'The creation date of the order',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  createdAt?: Date;

  @ApiProperty({
    example: '60d21b4667d0d8992e610c85',
    description: 'The ID of the user who placed the order',
  })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    example: 29.97,
    description: 'The total price of the order',
  })
  @IsNumber()
  @IsNotEmpty()
  total: number;
}
