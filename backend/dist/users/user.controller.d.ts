import { UserService } from './user.service';
import { CreateUserDto, UpdateUserDto } from '../users/dto/user.dto';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    create(createUserDto: CreateUserDto): Promise<import("./user.schema").User>;
    getAll(): Promise<import("./user.schema").User[]>;
    getOne(id: string): Promise<import("./user.schema").User>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<import("./user.schema").User>;
    delete(id: string): Promise<{
        message: string;
    }>;
}
