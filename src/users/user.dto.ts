import { UserRole } from './user.roles.enum';

export class CreateUserDto {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

export class UpdateUserDto {
  name?: string;
  email?: string;
  password?: string;
  role?: UserRole;
}
