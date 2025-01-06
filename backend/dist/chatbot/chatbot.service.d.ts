import { MenuService } from '../menu/menu.service';
import { OrderService } from '../orders/orders.service';
export declare class ChatbotService {
    private readonly menuService;
    private readonly orderService;
    constructor(menuService: MenuService, orderService: OrderService);
    handleMessage(message: string): Promise<string>;
    private formatMenuResponse;
    private extractOrderDetails;
}
