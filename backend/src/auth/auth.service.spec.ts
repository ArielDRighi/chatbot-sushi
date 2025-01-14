import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../users/user.service';
import { JwtService } from '@nestjs/jwt';
import {
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserRole } from '../users/user.roles.enum';
import { User } from '../users/user.schema';

jest.mock('../users/user.schema'); // Mockear la clase User

describe('AuthService', () => {
  let authService: AuthService;
  let userService: jest.Mocked<UserService>;
  let jwtService: jest.Mocked<JwtService>;

  beforeEach(async () => {
    const mockUserService = {
      findOneByEmail: jest.fn(),
      create: jest.fn(),
    };

    const mockJwtService = {
      sign: jest.fn().mockReturnValue('mockAccessToken'), // Mock de la respuesta esperada
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: mockUserService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userService = module.get(UserService);
    jwtService = module.get(JwtService);
  });

  describe('signup', () => {
    it('should register a user successfully', async () => {
      userService.findOneByEmail.mockResolvedValue(null); // Simula que el usuario no existe
      userService.create.mockResolvedValue(undefined); // Simula creación exitosa

      const result = await authService.signup({
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      });

      expect(result).toEqual({ message: 'User registered successfully.' });
      expect(userService.findOneByEmail).toHaveBeenCalledWith(
        'test@example.com',
      );
      expect(userService.create).toHaveBeenCalled();
    });

    it('should throw UnauthorizedException if email already exists', async () => {
      // Simulamos que el usuario ya existe con las propiedades completas
      userService.findOneByEmail.mockResolvedValue(
        new User({
          _id: '12345',
          email: 'test@example.com',
          password: await bcrypt.hash('password123', 10),
          name: 'Test User',
          role: UserRole.CUSTOMER,
        }),
      );

      await expect(
        authService.signup({
          email: 'test@example.com',
          password: 'password123',
          name: 'Test User',
        }),
      ).rejects.toThrow(UnauthorizedException);

      expect(userService.findOneByEmail).toHaveBeenCalledWith(
        'test@example.com',
      );
      expect(userService.create).not.toHaveBeenCalled();
    });

    it('should throw InternalServerErrorException for unexpected errors', async () => {
      userService.findOneByEmail.mockRejectedValue(new Error('Database error'));

      await expect(
        authService.signup({
          email: 'test@example.com',
          password: 'password123',
          name: 'Test User',
        }),
      ).rejects.toThrow(InternalServerErrorException);

      expect(userService.findOneByEmail).toHaveBeenCalledWith(
        'test@example.com',
      );
    });
  });

  describe('signin', () => {
    it('should throw UnauthorizedException if password is invalid', async () => {
      const user = {
        _id: '12345',
        email: 'test@example.com',
        password: await bcrypt.hash('password123', 10), // Hash correcto
        name: 'Test User',
      };

      userService.findOneByEmail.mockResolvedValue(
        new User({
          _id: '12345',
          email: 'test@example.com',
          password: await bcrypt.hash('password123', 10),
          name: 'Test User',
          role: UserRole.CUSTOMER,
        }),
      );

      // Usar jest.fn() para simular bcrypt.compare
      jest.spyOn(bcrypt, 'compare').mockImplementation(async () => false); // Simula que la comparación de contraseñas falla

      await expect(
        authService.signin({
          email: 'test@example.com',
          password: 'wrongPassword', // Contraseña incorrecta
        }),
      ).rejects.toThrow(UnauthorizedException);

      expect(userService.findOneByEmail).toHaveBeenCalledWith(
        'test@example.com',
      );
    });

    it('should throw UnauthorizedException if user does not have a password', async () => {
      // Usuario sin contraseña definida
      userService.findOneByEmail.mockResolvedValue(
        new User({
          _id: '12345',
          email: 'test@example.com',
          password: '', // Contraseña vacía
          name: 'Test User',
          role: UserRole.CUSTOMER,
        }),
      );

      await expect(
        authService.signin({
          email: 'test@example.com',
          password: 'anyPassword',
        }),
      ).rejects.toThrow(UnauthorizedException);

      expect(userService.findOneByEmail).toHaveBeenCalledWith(
        'test@example.com',
      );
    });
  });
});
