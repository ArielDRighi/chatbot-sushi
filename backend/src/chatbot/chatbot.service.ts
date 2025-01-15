import { Injectable, UnauthorizedException } from '@nestjs/common';
import { MenuService } from '../menu/menu.service';
import { OrderService } from '../orders/orders.service';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../users/user.service';

@Injectable()
export class ChatbotService {
  constructor(
    private readonly menuService: MenuService,
    private readonly orderService: OrderService,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async handleMessage(message: string, token: string): Promise<string> {
    try {
      const normalizedMessage = this.normalizeMessage(message);

      // Verificar token y obtener usuario
      let user;
      if (token) {
        try {
          const decoded = this.jwtService.verify(token);
          user = await this.userService.findOneById(decoded.sub);
          if (!user) {
            throw new UnauthorizedException('Usuario no encontrado.');
          }
        } catch (error) {
          console.error('Error al verificar el token:', error.message);
          // No retornar aquí, permitir que continúe para otros mensajes
        }
      }

      // Comando de ayuda
      if (normalizedMessage.includes('ayuda')) {
        return this.getHelpMessage();
      }

      // Saludo inicial
      if (normalizedMessage.includes('hola')) {
        if (
          normalizedMessage.includes('pedido') &&
          normalizedMessage.includes('orientar')
        ) {
          const recommendations = await this.menuService.getAllItems();
          if (recommendations.length === 0) {
            return `No encontré platos para recomendar. ¿Quieres buscar algo más?`;
          }
          return `🔍 Aquí tienes algunas recomendaciones:\n${this.formatMenuResponse(recommendations)}`;
        }
        return '¡Este es un challenge técnico para Nular, saludos a todo el equipo!';
      }

      // Respuesta para "estado de mi orden" o "seguimiento"
      if (this.containsOrderStatusQuery(normalizedMessage)) {
        if (!user) {
          return 'Por favor, inicia sesión para ver el estado de tus órdenes.';
        }

        const activeOrders = await this.orderService.getOrdersByUserId(
          user._id,
        );
        if (activeOrders.length === 0) {
          return 'No tienes órdenes en proceso.';
        }

        const ordersWithMenuNames =
          await this.getOrdersWithMenuItems(activeOrders);

        return this.formatOrderStatusResponse(ordersWithMenuNames);
      }

      // Respuesta para "menu" o "menú"
      if (this.containsMenuQuery(normalizedMessage)) {
        const menuItems = await this.menuService.getAllItems();
        return `🍣 A continuación te presento el menú:\n${this.formatMenuResponse(menuItems)}`;
      }

      // Requiere token solo para realizar una orden
      if (this.containsOrderRequest(normalizedMessage)) {
        if (!user) {
          return 'Por favor, inicia sesión o crea una cuenta para realizar un pedido.';
        }

        try {
          const orderDetails = this.extractOrderDetails(normalizedMessage);
          if (!orderDetails || orderDetails.length === 0) {
            return 'Por favor, especifica qué deseas ordenar. Ejemplo: "Quiero 2 sushi de salmón".';
          }

          const { items, total } = await this.processOrder(orderDetails, user);

          if (items.length === 0) {
            return 'Lo siento, no encontré un plato en el menú. Intenta de nuevo.';
          }

          return `✅ Tu orden ha sido registrada. Total: <b>$${total.toFixed(2)}</b>. ¡Gracias por tu pedido!`;
        } catch (error) {
          return error.message;
        }
      }

      // Respuesta para recomendaciones
      if (this.containsRecommendationQuery(normalizedMessage)) {
        const recommendations = await this.menuService.getAllItems();
        if (recommendations.length === 0) {
          return `No encontré platos para recomendar. ¿Quieres buscar algo más?`;
        }

        return `🔍 Aquí tienes algunas recomendaciones:\n${this.formatMenuResponse(recommendations)}`;
      }

      // Respuesta para horarios
      if (this.containsScheduleQuery(normalizedMessage)) {
        return '🕒 Estamos abiertos de lunes a domingo, de 12:00 a 22:00.';
      }

      // Respuesta para agradecimientos
      if (normalizedMessage.includes('gracias')) {
        return '🙏 ¡De nada! Si tienes alguna otra pregunta, no dudes en preguntar.';
      }

      // Respuesta para despedida
      if (this.containsGoodbyeQuery(normalizedMessage)) {
        return '👋 ¡Adiós! ¡Que tengas un excelente día!';
      }

      // Respuesta predeterminada
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
          `<div style="text-align: left;"><b>${item.name}</b>: $${item.price} - ${item.description}</div>`,
      )
      .join(''); // Eliminar el renglón vacío entre ítems
  }

  private extractOrderDetails(
    message: string,
  ): { itemName: string; quantity: number }[] {
    const numberWords: { [key: string]: number } = {
      uno: 1,
      una: 1,
      un: 1,
      dos: 2,
      tres: 3,
      cuatro: 4,
      cinco: 5,
      seis: 6,
      siete: 7,
      ocho: 8,
      nueve: 9,
      diez: 10,
    };

    const orderRegex =
      /(\d+|uno|una|un|dos|tres|cuatro|cinco|seis|siete|ocho|nueve|diez)\s+(sushi\s+de\s+\w+)/gi;
    const matches = [...message.matchAll(orderRegex)];

    // Verificar que cada pedido separado por "y" contenga la palabra "sushi"
    const parts = message.split('y');
    for (const part of parts) {
      if (!part.includes('sushi')) {
        throw new Error(
          'Formato de pedido incorrecto. Por favor, usa el formato: "Quiero [cantidad] sushi de [tipo]".',
        );
      }
    }

    if (matches.length === 0) return [];

    const orderDetails = matches.map((match) => {
      const quantity = isNaN(Number(match[1]))
        ? numberWords[match[1].toLowerCase()]
        : parseInt(match[1], 10);
      return {
        quantity,
        itemName: match[2].trim(),
      };
    });

    // Validar que cada pedido tenga el formato correcto
    const invalidOrders = orderDetails.filter(
      (order) => !order.itemName || !order.quantity,
    );

    if (invalidOrders.length > 0 || orderDetails.length !== matches.length) {
      throw new Error(
        'Formato de pedido incorrecto. Por favor, usa el formato: "Quiero [cantidad] sushi de [tipo]".',
      );
    }

    return orderDetails;
  }

  private containsOrderStatusQuery(message: string): boolean {
    return (
      message.includes('estado de mi orden') || message.includes('seguimiento')
    );
  }

  private async getOrdersWithMenuItems(orders: any[]): Promise<any[]> {
    return Promise.all(
      orders.map(async (order) => {
        const itemsWithNames = await Promise.all(
          order.items.map(async (item) => {
            const menuItem = await this.menuService.getItemById(item.productId);
            return {
              name: menuItem.name,
              quantity: item.quantity,
              status: order.status,
            };
          }),
        );
        return itemsWithNames;
      }),
    );
  }

  private formatOrderStatusResponse(ordersWithMenuNames: any[]): string {
    return `📦 Aquí tienes el estado de tus órdenes:\n${ordersWithMenuNames
      .map((order) =>
        order
          .map(
            (item) =>
              `<div style="text-align: left;"><b>Producto:</b> ${item.name} - <b>Cantidad:</b> ${item.quantity} - <b>Estado:</b> ${item.status}</div>`,
          )
          .join(''),
      )
      .join('')}`;
  }

  private containsMenuQuery(message: string): boolean {
    return message.includes('menu') || message.includes('menú');
  }

  private containsOrderRequest(message: string): boolean {
    return (
      message.includes('orden') ||
      message.includes('pedido') ||
      message.includes('quiero') ||
      message.includes('quisiera')
    );
  }

  private async processOrder(
    orderDetails: any[],
    user: any,
  ): Promise<{ items: any[]; total: number }> {
    let items = [];
    let total = 0;

    for (const detail of orderDetails) {
      const menuItem = await this.menuService.getItemByName(detail.itemName);
      if (!menuItem) {
        continue;
      }
      items.push({
        productId: menuItem._id.toString(),
        quantity: detail.quantity,
      });
      total += menuItem.price * detail.quantity;
    }

    if (items.length > 0) {
      await this.orderService.create({
        customerName: user.name || 'Cliente Anónimo',
        userId: user._id, // Asegurarse de que el ID del usuario se pase aquí
        items,
        total,
        status: 'pending',
      });
    }

    return { items, total };
  }

  private containsRecommendationQuery(message: string): boolean {
    return (
      message.includes('recomendar') ||
      message.includes('recomendacion') ||
      message.includes('recomiendas') ||
      message.includes('sugerencia') ||
      message.includes('que me recomiendas')
    );
  }

  private containsScheduleQuery(message: string): boolean {
    return (
      message.includes('horarios') ||
      message.includes('horario') ||
      message.includes('abierto') ||
      message.includes('abiertos') ||
      message.includes('cerrado')
    );
  }

  private containsGoodbyeQuery(message: string): boolean {
    return message.includes('adios') || message.includes('chau');
  }

  private getHelpMessage(): string {
    return (
      '🤖 <b>Aquí tienes algunos comandos que puedes usar para interactuar conmigo:</b>' +
      '<ul style="text-align: left;">' +
      '<li>💬 <b>"Hola"</b>: Saludo inicial.</li>' +
      '<li>📋 <b>"Menú"</b>: Mostrar el menú.</li>' +
      '<li>📦 <b>"Estado de mi orden"</b>: Ver el estado de tus órdenes.</li>' +
      '<li>📝 <b>"Quiero [cantidad] sushi de [tipo]"</b>: Realizar un pedido.<br><i>Ejemplo: "Quiero 2 sushi de salmón y 3 sushi de atún"</i></li>' +
      '<li>🔍 <b>"Que me recomiendas"</b>: Obtener recomendaciones de menú.</li>' +
      '<li>🕒 <b>"Horarios"</b>: Consultar los horarios de apertura.</li>' +
      '<li>🙏 <b>"Gracias"</b>: Agradecer.</li>' +
      '<li>👋 <b>"Adios"</b>: Despedirse y cerrar sesión.</li>' +
      '</ul>'
    );
  }
}
