import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false, // No ignorar la expiración del token
      secretOrKey: process.env.JWT_SECRET || 'yourSecretKey', // Clave secreta
    });
  }

  async validate(payload: any) {
    // Aquí podrías agregar lógica adicional para validar el usuario
    return { userId: payload.sub, email: payload.email, role: payload.role };
  }
}
