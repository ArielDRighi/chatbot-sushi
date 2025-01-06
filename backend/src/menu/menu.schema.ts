import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

@Schema()
export class MenuItem extends Document {
  @ApiProperty({
    example: 'Sushi de Salmón',
    description: 'The name of the menu item',
  })
  @Prop({ required: true })
  name: string;

  @ApiProperty({
    example: 'Delicious salmon sushi',
    description: 'The description of the menu item',
  })
  @Prop({ required: true })
  description: string;

  @ApiProperty({ example: 10.99, description: 'The price of the menu item' })
  @Prop({ required: true })
  price: number;

  @ApiProperty({ example: true, description: 'Availability of the menu item' })
  @Prop({ required: true })
  available: boolean;
}

export const MenuItemSchema = SchemaFactory.createForClass(MenuItem);
