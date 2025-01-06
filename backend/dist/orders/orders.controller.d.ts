import { OrderService } from './orders.service';
import { Order } from './order.schema';
import { CreateOrderDto } from './dto/create-order.dto';
export declare class OrderController {
    private readonly orderService;
    constructor(orderService: OrderService);
    createOrder(orderData: CreateOrderDto): Promise<Order>;
    getAllOrders(): Promise<Order[]>;
    getOrderById(id: string): Promise<Order>;
    updateOrder(id: string, orderData: Partial<Order>): Promise<Order>;
    deleteOrder(id: string): Promise<Order>;
}
