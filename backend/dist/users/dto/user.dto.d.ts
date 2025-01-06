import { UserRole } from '../user.roles.enum';
export declare class CreateUserDto {
    name: string;
    email: string;
    password: string;
    role: UserRole;
}
export declare class UpdateUserDto {
    name?: string;
    email?: string;
    password?: string;
    role?: UserRole;
}
