import { JwtService } from '@nestjs/jwt';
import { UserService } from '../users/user.service';
import { SignUpDto, SignInDto } from './dto/auth.dto';
export declare class AuthService {
    private readonly userService;
    private readonly jwtService;
    constructor(userService: UserService, jwtService: JwtService);
    signup(signUpDto: SignUpDto): Promise<{
        message: string;
    }>;
    signin(signInDto: SignInDto): Promise<{
        accessToken: string;
    }>;
}
