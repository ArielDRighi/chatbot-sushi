import { Model } from 'mongoose';
import { Order } from './order.schema';
import { MenuItem } from '../menu/menu.schema';
import { CreateOrderDto } from './dto/create-order.dto';
export declare class OrderService {
    private orderModel;
    private menuItemModel;
    constructor(orderModel: Model<Order>, menuItemModel: Model<MenuItem>);
    create(createOrderDto: CreateOrderDto): Promise<Order>;
    getAllOrders(): Promise<Order[]>;
    getOrderById(id: string): Promise<Order>;
    getActiveOrders(): Promise<Order[]>;
    updateOrder(id: string, updateOrderDto: Partial<CreateOrderDto>): Promise<Order>;
    deleteOrder(id: string): Promise<Order>;
    deleteAll(): Promise<void>;
}
