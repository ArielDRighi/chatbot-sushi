import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderController } from './orders.controller';
import { OrderService } from './orders.service';
import { OrderSchema } from './order.schema';
import { MenuModule } from '../menu/menu.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Order', schema: OrderSchema }]),
    MenuModule,
  ],
  controllers: [OrderController],
  providers: [OrderService],
  exports: [OrderService, MongooseModule],
})
export class OrderModule {}
