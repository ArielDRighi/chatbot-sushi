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
    // Verificación de usuario autenticado
    if (!createOrderDto.userId) {
      throw new Error('Por favor, inicia sesión para realizar un pedido.');
    }

    try {
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
        userId: createOrderDto.userId,
      });

      return order.save();
    } catch (error) {
      console.error('Error creating order:', error);
      throw new Error('Error creating order. Please try again later.');
    }
  }

  async getAllOrders(): Promise<Order[]> {
    try {
      return this.orderModel.find().exec();
    } catch (error) {
      console.error('Error fetching all orders:', error);
      throw new Error('Error fetching all orders. Please try again later.');
    }
  }

  async getOrderById(id: string): Promise<Order> {
    try {
      const order = await this.orderModel.findById(id).exec();
      if (!order) {
        throw new NotFoundException(`Order with ID ${id} not found`);
      }
      return order;
    } catch (error) {
      console.error(`Error fetching order by ID ${id}:`, error);
      throw new Error('Error fetching order by ID. Please try again later.');
    }
  }

  async getActiveOrders(): Promise<Order[]> {
    try {
      const activeStatuses = ['pending', 'in_progress', 'completed'];
      return this.orderModel.find({ status: { $in: activeStatuses } }).exec();
    } catch (error) {
      console.error('Error fetching active orders:', error);
      throw new Error('Error fetching active orders. Please try again later.');
    }
  }

  async getOrdersByUserId(userId: string): Promise<Order[]> {
    try {
      return this.orderModel.find({ userId }).exec();
    } catch (error) {
      console.error(`Error fetching orders for user ID ${userId}:`, error);
      throw new Error('Error fetching orders. Please try again later.');
    }
  }

  async updateOrder(
    id: string,
    updateOrderDto: Partial<CreateOrderDto>,
  ): Promise<Order> {
    try {
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
    } catch (error) {
      console.error(`Error updating order with ID ${id}:`, error);
      throw new Error('Error updating order. Please try again later.');
    }
  }

  async deleteOrder(id: string): Promise<Order> {
    try {
      const deletedOrder = await this.orderModel.findByIdAndDelete(id).exec();
      if (!deletedOrder) {
        throw new NotFoundException(`Order with ID ${id} not found`);
      }
      return deletedOrder;
    } catch (error) {
      console.error(`Error deleting order with ID ${id}:`, error);
      throw new Error('Error deleting order. Please try again later.');
    }
  }

  async deleteAll(): Promise<void> {
    try {
      await this.orderModel.deleteMany({}).exec();
    } catch (error) {
      console.error('Error deleting all orders:', error);
      throw new Error('Error deleting all orders. Please try again later.');
    }
  }
}
