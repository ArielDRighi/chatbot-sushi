import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../users/user.service';
import { SignUpDto, SignInDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { UserRole } from '../users/user.roles.enum';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async signup(signUpDto: SignUpDto): Promise<{ message: string }> {
    const { email } = signUpDto;

    // Verificar si el usuario ya existe
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

    // Crear el usuario
    await this.userService.create({
      ...signUpDto,
      role: UserRole.CUSTOMER,
    });

    return { message: 'User registered successfully.' };
  }

  async signin(signInDto: SignInDto): Promise<{ accessToken: string }> {
    const { email, password } = signInDto;

    // Buscar el usuario por correo
    const user = await this.userService.findOneByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    // Comparar las contraseñas
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    // Generar el token JWT
    const payload = { sub: user._id, email: user.email, role: user.role };
    const accessToken = await this.jwtService.sign(payload);

    return { accessToken };
  }
}
