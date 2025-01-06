import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from './user.roles.enum';

@Schema()
export class User extends Document {
  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'The email of the user',
  })
  @Prop({ required: true, unique: true })
  email: string;

  @ApiProperty({
    example: 'password123',
    description: 'The password of the user',
  })
  @Prop({ required: true })
  password: string;

  @ApiProperty({ example: 'John Doe', description: 'The name of the user' })
  @Prop({ required: true })
  name: string;

  @ApiProperty({
    example: UserRole.CUSTOMER,
    description: 'The role of the user',
  })
  @Prop({
    type: String,
    enum: [UserRole.CUSTOMER, UserRole.ADMIN],
    default: UserRole.CUSTOMER,
  })
  role: UserRole;
}

export const UserSchema = SchemaFactory.createForClass(User);
