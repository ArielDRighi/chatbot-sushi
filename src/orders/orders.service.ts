import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order } from './order.schema';

@Injectable()
export class OrderService {
  constructor(@InjectModel('Order') private orderModel: Model<Order>) {}

  // Método para crear un pedido
  async create(orderData: Partial<Order>): Promise<Order> {
    const order = new this.orderModel(orderData);
    return order.save();
  }
}
