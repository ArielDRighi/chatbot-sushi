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
    try {
      const normalizedMessage = this.normalizeMessage(message);

      if (normalizedMessage.includes('hola')) {
        return '👋 ¡Hola! Esta es una prueba técnica para la empresa Nular. ¡Saludos a todo el equipo!';
      }

      if (
        normalizedMessage.includes('menu') ||
        normalizedMessage.includes('menú')
      ) {
        const menuItems = await this.menuService.getAllItems();
        return `🍣 A continuación te presento el menú:\n${this.formatMenuResponse(menuItems)}`;
      }

      if (
        normalizedMessage.includes('orden') ||
        normalizedMessage.includes('pedido') ||
        normalizedMessage.includes('quiero')
      ) {
        const orderDetails = this.extractOrderDetails(normalizedMessage);
        if (!orderDetails || orderDetails.length === 0) {
          return 'Por favor, especifica qué deseas ordenar. Ejemplo: "Quiero 2 sushi de salmón".';
        }

        let items = [];
        let total = 0;

        for (const detail of orderDetails) {
          const menuItem = await this.menuService.getItemByName(
            detail.itemName,
          );
          if (!menuItem) {
            return `Lo siento, no encontré un plato llamado "${detail.itemName}". Por favor, verifica el menú.`;
          }
          items.push({
            productId: menuItem._id.toString(),
            quantity: detail.quantity,
          });
          total += menuItem.price * detail.quantity;
        }

        const order = await this.orderService.create({
          customerName: 'Cliente Anónimo',
          items,
          total,
          status: 'pending',
        });

        return `✅ Tu orden ha sido registrada. Total: <b>$${total.toFixed(2)}</b>. ¡Gracias por tu pedido!`;
      }

      if (
        normalizedMessage.includes('estado de mi orden') ||
        normalizedMessage.includes('seguimiento')
      ) {
        const activeOrders = await this.orderService.getActiveOrders();
        if (activeOrders.length === 0) {
          return 'No tienes órdenes en proceso.';
        }

        return `📦 Aquí tienes el estado de tus órdenes:\n${activeOrders
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

      if (
        normalizedMessage.includes('recomendar') ||
        normalizedMessage.includes('recomendacion') ||
        normalizedMessage.includes('recomiendas') ||
        normalizedMessage.includes('que me recomiendas')
      ) {
        const recommendations = await this.menuService.getAllItems();
        if (recommendations.length === 0) {
          return `No encontré platos para recomendar. ¿Quieres buscar algo más?`;
        }

        return `🔍 Aquí tienes algunas recomendaciones:\n${this.formatMenuResponse(recommendations)}`;
      }

      if (
        normalizedMessage.includes('horarios') ||
        normalizedMessage.includes('horario') ||
        normalizedMessage.includes('abierto') ||
        normalizedMessage.includes('cerrado')
      ) {
        return '🕒 Estamos abiertos de lunes a domingo, de 12:00 a 22:00.';
      }

      if (normalizedMessage.includes('gracias')) {
        return '🙏 ¡De nada! Si tienes alguna otra pregunta, no dudes en preguntar.';
      }

      if (
        normalizedMessage.includes('adios') ||
        normalizedMessage.includes('chau')
      ) {
        return '👋 ¡Adiós! ¡Que tengas un excelente día!';
      }

      return 'Lo siento, no entendí tu mensaje. Puedes intentar con: "Mostrar menú" o "¿Qué me recomiendas?".';
    } catch (error) {
      console.error('Error handling message:', error);
      return 'Ocurrió un error al procesar tu solicitud. Por favor, intenta nuevamente más tarde.';
    }
  }

  async getMenuItems(): Promise<any[]> {
    try {
      return this.menuService.getAllItems();
    } catch (error) {
      console.error('Error fetching menu items:', error);
      throw new Error('Error fetching menu items. Please try again later.');
    }
  }

  private normalizeMessage(message: string): string {
    return message
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();
  }

  private formatMenuResponse(menuItems: any[]): string {
    if (menuItems.length === 0) {
      return 'El menú está vacío por el momento.';
    }
    return menuItems
      .map(
        (item) =>
          `<div><b>${item.name}</b>: $${item.price} - ${item.description}</div>`,
      )
      .join('\n');
  }

  private extractOrderDetails(
    message: string,
  ): { itemName: string; quantity: number }[] {
    const orderRegex = /(\d+)\s+(sushi\s+de\s+\w+)/gi;
    const matches = [...message.matchAll(orderRegex)];

    if (matches.length === 0) return [];

    return matches.map((match) => ({
      quantity: parseInt(match[1], 10),
      itemName: match[2].trim(),
    }));
  }
}
