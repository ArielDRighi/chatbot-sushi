import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order } from './order.schema';
import { MenuItem } from '../menu/menu.schema';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel('Order') private orderModel: Model<Order>,
    @InjectModel('MenuItem') private menuItemModel: Model<MenuItem>,
  ) {}

  async create(orderData: Partial<Order>): Promise<Order> {
    const itemsWithPrices = await Promise.all(
      orderData.items.map(async (item) => {
        const menuItem = await this.menuItemModel
          .findById(item.productId)
          .exec();
        if (!menuItem) {
          throw new NotFoundException(
            `Menu item with ID ${item.productId} not found`,
          );
        }
        return {
          ...item,
          price: menuItem.price,
        };
      }),
    );

    const total = itemsWithPrices.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    const order = new this.orderModel({
      ...orderData,
      items: itemsWithPrices,
      total,
    });

    return order.save();
  }

  async getAllOrders(): Promise<Order[]> {
    return this.orderModel.find().exec();
  }

  async getOrderById(id: string): Promise<Order> {
    return this.orderModel.findById(id).exec();
  }

  async updateOrder(id: string, orderData: Partial<Order>): Promise<Order> {
    let itemsWithPrices = [];
    let total = 0;

    if (orderData.items) {
      itemsWithPrices = await Promise.all(
        orderData.items.map(async (item) => {
          const menuItem = await this.menuItemModel
            .findById(item.productId)
            .exec();
          if (!menuItem) {
            throw new NotFoundException(
              `Menu item with ID ${item.productId} not found`,
            );
          }
          return {
            ...item,
            price: menuItem.price,
          };
        }),
      );

      total = itemsWithPrices.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
      );
    }

    return this.orderModel
      .findByIdAndUpdate(
        id,
        {
          ...orderData,
          ...(orderData.items && { items: itemsWithPrices, total }),
        },
        { new: true },
      )
      .exec();
  }

  async deleteOrder(id: string): Promise<Order> {
    return this.orderModel.findByIdAndDelete(id).exec();
  }

  async deleteAll(): Promise<void> {
    await this.orderModel.deleteMany({}).exec();
  }
}
