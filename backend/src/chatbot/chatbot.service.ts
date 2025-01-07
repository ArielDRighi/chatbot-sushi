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
      return `A continuación te presento el menú:\n${this.formatMenuResponse(menuItems)}`;
    }

    if (
      normalizedMessage.includes('orden') ||
      normalizedMessage.includes('pedido') ||
      normalizedMessage.includes('quiero')
    ) {
      const orderDetails = this.extractOrderDetails(message);
      if (!orderDetails || orderDetails.length === 0) {
        return 'Por favor, especifica qué deseas ordenar. Ejemplo: "Quiero 2 sushi de salmón".';
      }

      const items = [];
      let total = 0;

      for (const detail of orderDetails) {
        const menuItem = await this.menuService.getItemByName(detail.itemName);
        if (!menuItem) {
          return `Lo siento, no encontré un plato llamado "${detail.itemName}". Por favor, verifica el menú.`;
        }
        items.push({
          productId: menuItem._id.toString(),
          quantity: detail.quantity,
        });
        total += menuItem.price * detail.quantity;
      }

      // Crear una orden compatible con el esquema de MongoDB
      const order = await this.orderService.create({
        customerName: 'Cliente Anónimo', // Esto debería obtenerse dinámicamente si es posible
        items,
        total,
        status: 'pending',
      });

      return `Tu orden ha sido registrada. Total: $${order.total}. ¡Gracias por tu pedido!`;
    }

    if (
      normalizedMessage.includes('estado de mi orden') ||
      normalizedMessage.includes('seguimiento')
    ) {
      const activeOrders = await this.orderService.getActiveOrders();
      if (activeOrders.length === 0) {
        return 'No tienes órdenes en proceso.';
      }

      return `Aquí tienes el estado de tus órdenes:\n${activeOrders
        .map((order) =>
          order.items
            .map(
              (item) =>
                `Producto ID: ${item.productId} - Cantidad: ${item.quantity} - Estado: ${order.status}`,
            )
            .join('\n'),
        )
        .join('\n')}`;
    }

    if (normalizedMessage.includes('recomendar')) {
      const keyword = normalizedMessage.replace('recomendar', '').trim();
      const recommendations = await this.menuService.getItemsByKeyword(keyword);
      if (recommendations.length === 0) {
        return `No encontré platos relacionados con "${keyword}". ¿Quieres buscar algo más?`;
      }

      return `Aquí tienes algunas recomendaciones:\n${recommendations
        .map((item) => `${item.name}: $${item.price} - ${item.description}`)
        .join('\n')}`;
    }

    if (
      normalizedMessage.includes('horarios') ||
      normalizedMessage.includes('horario') ||
      normalizedMessage.includes('abierto') ||
      normalizedMessage.includes('cerrado')
    ) {
      return 'Estamos abiertos de lunes a domingo, de 12:00 a 22:00.';
    }

    return 'Lo siento, no entendí tu mensaje. Por favor, intenta de nuevo.';
  }

  async getMenuItems(): Promise<any[]> {
    return this.menuService.getAllItems();
  }

  private formatMenuResponse(menuItems: any[]): string {
    if (menuItems.length === 0) {
      return 'El menú está vacío por el momento.';
    }
    return menuItems
      .map((item) => `${item.name}: $${item.price} - ${item.description}`)
      .join('\n');
  }

  private extractOrderDetails(
    message: string,
  ): { itemName: string; quantity: number }[] {
    const orderRegex = /quiero\s+(\d+)\s+(.+?)(?=\s+y\s+|$)/gi; // Ejemplo: "Quiero 2 sushi de salmón y 1 sushi de atún"
    const matches = [...message.matchAll(orderRegex)];
    return matches.map((match) => ({
      quantity: parseInt(match[1], 10),
      itemName: match[2].trim(),
    }));
  }
}
