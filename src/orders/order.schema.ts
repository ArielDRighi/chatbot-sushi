import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

class OrderItem {
  @ApiProperty({
    example: '60d21b4667d0d8992e610c85',
    description: 'The ID of the product',
  })
  @Prop({ required: true })
  productId: string;

  @ApiProperty({ example: 2, description: 'The quantity of the product' })
  @Prop({ required: true })
  quantity: number;
}

@Schema()
export class Order extends Document {
  @ApiProperty({
    example: 'Juan Pérez',
    description: 'The name of the customer',
  })
  @Prop({ required: true })
  customerName: string;

  @ApiProperty({ type: [OrderItem], description: 'The items in the order' })
  @Prop({ type: [OrderItem], required: true })
  items: OrderItem[];

  @ApiProperty({ example: 29.97, description: 'The total price of the order' })
  @Prop({ required: true })
  total: number;

  @ApiProperty({ example: 'pending', description: 'The status of the order' })
  @Prop({ default: 'pending' })
  status: string;

  @ApiProperty({
    example: '2023-10-01T00:00:00.000Z',
    description: 'The creation date of the order',
  })
  @Prop({ default: Date.now })
  createdAt: Date;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
