import { Schema, Document } from 'mongoose';
import { UserRole } from './user.roles.enum';

export interface User extends Document {
  email: string;
  password: string;
  name: string;
  role: UserRole;
}

export const UserSchema = new Schema<User>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  role: {
    type: String,
    enum: [UserRole.CUSTOMER, UserRole.ADMIN],
    default: UserRole.CUSTOMER,
  },
});
