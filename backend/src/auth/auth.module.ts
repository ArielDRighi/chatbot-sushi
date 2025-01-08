import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/user.module';
import { UserService } from '../users/user.service';

@Module({
  imports: [forwardRef(() => UsersModule)],
  providers: [AuthService, UserService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
