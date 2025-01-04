import {
  IsString,
  IsArray,
  IsNumber,
  IsOptional,
  ValidateNested,
  IsDate,
} from 'class-validator';
import { Type } from 'class-transformer';

class OrderItemDto {
  @IsString()
  productId: string;

  @IsNumber()
  quantity: number;
}

export class CreateOrderDto {
  @IsString()
  customerName: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @IsNumber()
  total: number;

  @IsString()
  @IsOptional()
  status?: string; // Default value can be set in the service or schema

  @IsDate()
  @IsOptional()
  createdAt?: Date; // Default value can be set in the service or schema
}
