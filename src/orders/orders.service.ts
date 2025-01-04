import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order } from './order.schema';
import { MenuItem } from '../menu/menu.schema';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel('Order') private orderModel: Model<Order>,
    @InjectModel('MenuItem') private menuItemModel: Model<MenuItem>,
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const itemsWithPrices = await Promise.all(
      createOrderDto.items.map(async (item) => {
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
      customerName: createOrderDto.customerName,
      items: itemsWithPrices,
      total,
      status: createOrderDto.status || 'pending',
      createdAt: createOrderDto.createdAt || new Date(),
    });

    return order.save();
  }

  async getAllOrders(): Promise<Order[]> {
    return this.orderModel.find().exec();
  }

  async getOrderById(id: string): Promise<Order> {
    const order = await this.orderModel.findById(id).exec();
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return order;
  }

  async getActiveOrders(): Promise<Order[]> {
    const activeStatuses = ['pending', 'in_progress', 'completed'];

    return this.orderModel.find({ status: { $in: activeStatuses } }).exec();
  }

  async updateOrder(
    id: string,
    updateOrderDto: Partial<CreateOrderDto>,
  ): Promise<Order> {
    let itemsWithPrices = [];
    let total = 0;

    if (updateOrderDto.items) {
      itemsWithPrices = await Promise.all(
        updateOrderDto.items.map(async (item) => {
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

    const updatedOrder = await this.orderModel
      .findByIdAndUpdate(
        id,
        {
          ...updateOrderDto,
          ...(updateOrderDto.items && { items: itemsWithPrices, total }),
        },
        { new: true },
      )
      .exec();

    if (!updatedOrder) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return updatedOrder;
  }

  async deleteOrder(id: string): Promise<Order> {
    const deletedOrder = await this.orderModel.findByIdAndDelete(id).exec();
    if (!deletedOrder) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return deletedOrder;
  }

  async deleteAll(): Promise<void> {
    await this.orderModel.deleteMany({}).exec();
  }
}
