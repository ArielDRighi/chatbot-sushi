import { AuthService } from './auth.service';
import { SignUpDto, SignInDto } from './dto/auth.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    signup(signUpDto: SignUpDto): Promise<{
        message: string;
    }>;
    signin(signInDto: SignInDto): Promise<{
        accessToken: string;
    }>;
}
