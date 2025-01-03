import { Injectable } from '@nestjs/common';
import { MenuService } from '../menu/menu.service';
import { OrderService } from '../orders/orders.service';

@Injectable()
export class ChatbotService {
  constructor(
    private readonly menuService: MenuService,
    private readonly orderService: OrderService,
  ) {}

  async handleMessage(message: string): Promise<string> {
    const normalizedMessage = message.toLowerCase();

    if (
      normalizedMessage.includes('menú') ||
      normalizedMessage.includes('menu')
    ) {
      const menuItems = await this.menuService.getAllItems();
      return this.formatMenuResponse(menuItems);
    }

    if (
      normalizedMessage.includes('orden') ||
      normalizedMessage.includes('pedido')
    ) {
      return 'Por favor, dime qué deseas ordenar. Ejemplo: "Quiero 2 sushi de salmón".';
    }

    if (normalizedMessage.includes('horarios')) {
      return 'Estamos abiertos de lunes a domingo, de 12:00 a 22:00.';
    }

    return 'Lo siento, no entendí tu mensaje. Por favor, intenta de nuevo.';
  }

  private formatMenuResponse(menuItems: any[]): string {
    if (menuItems.length === 0) {
      return 'El menú está vacío por el momento.';
    }
    return menuItems
      .map((item) => `${item.name}: $${item.price} - ${item.description}`)
      .join('\n');
  }
}
