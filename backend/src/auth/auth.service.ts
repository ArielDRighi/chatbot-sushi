import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { UserService } from '../users/user.service';
import { SignUpDto, SignInDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { UserRole } from '../users/user.roles.enum';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {}

  async signup(signUpDto: SignUpDto): Promise<{ message: string }> {
    const { email } = signUpDto;

    let existingUser;
    try {
      existingUser = await this.userService.findOneByEmail(email);
    } catch (error) {
      if (error instanceof NotFoundException) {
        existingUser = null;
      } else {
        throw error;
      }
    }

    if (existingUser) {
      throw new UnauthorizedException('Email is already registered.');
    }

    await this.userService.create({
      ...signUpDto,
      role: UserRole.CUSTOMER,
    });

    return { message: 'User registered successfully.' };
  }

  async signin(signInDto: SignInDto): Promise<{ message: string }> {
    const { email, password } = signInDto;

    const user = await this.userService.findOneByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    return { message: 'User signed in successfully.' };
  }
}
