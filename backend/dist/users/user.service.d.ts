import { Model } from 'mongoose';
import { User } from './user.schema';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
export declare class UserService {
    private userModel;
    constructor(userModel: Model<User>);
    private hashPassword;
    create(createUserDto: CreateUserDto): Promise<User>;
    findByEmail(email: string): Promise<User>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<User>;
    delete(id: string): Promise<{
        message: string;
    }>;
    getAllUsers(): Promise<User[]>;
}
