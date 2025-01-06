import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto, SignInDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() signUpDto: SignUpDto) {
    return this.authService.signup(signUpDto);
  }

  @Post('signin')
  async signin(@Body() signInDto: SignInDto) {
    return this.authService.signin(signInDto);
  }
}
