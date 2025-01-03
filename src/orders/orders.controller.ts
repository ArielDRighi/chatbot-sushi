import { Controller, Post, Body } from '@nestjs/common';
import { OrderService } from './orders.service';
import { Order } from './order.schema';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  // Endpoint para crear un pedido
  @Post()
  async createOrder(@Body() orderData: Partial<Order>): Promise<Order> {
    return this.orderService.create(orderData);
  }
}
