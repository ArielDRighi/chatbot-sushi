import { Module } from '@nestjs/common';
import { ChatbotService } from './chatbot.service';
import { ChatbotController } from './chatbot.controller';
import { MenuModule } from '../menu/menu.module';
import { OrderModule } from '../orders/orders.module';
import { OrderService } from 'src/orders/orders.service';
import { MenuService } from 'src/menu/menu.service';

@Module({
  imports: [MenuModule, OrderModule],
  controllers: [ChatbotController],
  providers: [ChatbotService, OrderService, MenuService],
})
export class ChatbotModule {}
