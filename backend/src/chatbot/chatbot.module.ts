import { Module } from '@nestjs/common';
import { ChatbotService } from './chatbot.service';
import { ChatbotController } from './chatbot.controller';
import { MenuModule } from '../menu/menu.module';
import { OrderModule } from '../orders/orders.module';
import { OrderService } from '../orders/orders.service';
import { MenuService } from '../menu/menu.service';
import { UserService } from '../users/user.service';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/user.module';

@Module({
  imports: [MenuModule, OrderModule, AuthModule, UsersModule],
  controllers: [ChatbotController],
  providers: [ChatbotService, OrderService, MenuService, UserService],
})
export class ChatbotModule {}
