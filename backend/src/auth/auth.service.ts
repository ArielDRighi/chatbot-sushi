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
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async signup(signUpDto: SignUpDto): Promise<{ message: string }> {
    const { email } = signUpDto;

    try {
      // Verificamos si el usuario ya existe
      const existingUser = await this.userService.findOneByEmail(email);

      if (existingUser) {
        throw new UnauthorizedException('Email is already registered.');
      }

      // Si no existe, procedemos a crear el nuevo usuario
      await this.userService.create({
        ...signUpDto,
        role: UserRole.CUSTOMER,
      });

      return { message: 'User registered successfully.' };
    } catch (error) {
      console.error('Error during signup:', error);
      // Aquí estamos atrapando cualquier error en el proceso de signup
      if (error instanceof UnauthorizedException) {
        throw error; // Re-lanzamos el error si es UnauthorizedException
      }
      // De lo contrario, lanzamos un error genérico del servidor
      throw new InternalServerErrorException(
        'Error during signup. Please try again later.',
      );
    }
  }

  async signin(
    signInDto: SignInDto,
  ): Promise<{ accessToken: string; userName: string }> {
    const { email, password } = signInDto;
    const user = await this.userService.findOneByEmail(email);

    // Verificar si el usuario existe
    if (!user) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    // Verificar que user.password esté definido
    if (!user.password) {
      throw new UnauthorizedException('User password is not defined.');
    }

    // Comparar la contraseña proporcionada con el hash almacenado en la base de datos
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    // Si la contraseña es válida, generamos un JWT (accessToken)
    const payload = { sub: user._id, email: user.email };
    const accessToken = this.jwtService.sign(payload);
    return { accessToken, userName: user.name };
  }
}
