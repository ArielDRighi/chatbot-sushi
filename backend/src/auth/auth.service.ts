import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
  Inject,
  forwardRef,
  InternalServerErrorException,
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

    try {
      let existingUser;
      try {
        existingUser = await this.userService.findOneByEmail(email);
      } catch (error) {
        if (error instanceof NotFoundException) {
          existingUser = null;
        } else {
          throw new InternalServerErrorException(
            'Error checking existing user',
          );
        }
      }

      if (existingUser) {
        throw new UnauthorizedException('Email is already registered.');
      }

      const hashedPassword = await bcrypt.hash(signUpDto.password, 10);

      await this.userService.create({
        ...signUpDto,
        password: hashedPassword,
        role: UserRole.CUSTOMER,
      });

      return { message: 'User registered successfully.' };
    } catch (error) {
      console.error('Error during signup:', error);
      throw new InternalServerErrorException(
        'Error during signup. Please try again later.',
      );
    }
  }

  async signin(signInDto: SignInDto): Promise<{ message: string }> {
    const { email, password } = signInDto;

    try {
      const user = await this.userService.findOneByEmail(email);
      if (!user) {
        throw new UnauthorizedException('Invalid email or password.');
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid email or password.');
      }

      return { message: 'User signed in successfully.' };
    } catch (error) {
      console.error('Error during signin:', error);
      throw new InternalServerErrorException(
        'Error during signin. Please try again later.',
      );
    }
  }
}
