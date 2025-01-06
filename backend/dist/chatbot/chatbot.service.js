"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatbotService = void 0;
const common_1 = require("@nestjs/common");
const menu_service_1 = require("../menu/menu.service");
const orders_service_1 = require("../orders/orders.service");
let ChatbotService = class ChatbotService {
    constructor(menuService, orderService) {
        this.menuService = menuService;
        this.orderService = orderService;
    }
    async handleMessage(message) {
        const normalizedMessage = message.toLowerCase();
        if (normalizedMessage.includes('menú') ||
            normalizedMessage.includes('menu')) {
            const menuItems = await this.menuService.getAllItems();
            return this.formatMenuResponse(menuItems);
        }
        if (normalizedMessage.includes('orden') ||
            normalizedMessage.includes('pedido') ||
            normalizedMessage.includes('quiero')) {
            const orderDetails = this.extractOrderDetails(message);
            if (!orderDetails) {
                return 'Por favor, especifica qué deseas ordenar. Ejemplo: "Quiero 2 sushi de salmón".';
            }
            const menuItem = await this.menuService.getItemByName(orderDetails.itemName);
            if (!menuItem) {
                return `Lo siento, no encontré un plato llamado "${orderDetails.itemName}". Por favor, verifica el menú.`;
            }
            const order = await this.orderService.create({
                customerName: 'Cliente Anónimo',
                items: [
                    {
                        productId: menuItem._id.toString(),
                        quantity: orderDetails.quantity,
                    },
                ],
                total: menuItem.price * orderDetails.quantity,
                status: 'pending',
            });
            return `Tu orden de ${order.items[0].quantity} ${menuItem.name} ha sido registrada. Total: $${order.total}. ¡Gracias por tu pedido!`;
        }
        if (normalizedMessage.includes('estado de mi orden') ||
            normalizedMessage.includes('seguimiento')) {
            const activeOrders = await this.orderService.getActiveOrders();
            if (activeOrders.length === 0) {
                return 'No tienes órdenes en proceso.';
            }
            return activeOrders
                .map((order) => order.items
                .map((item) => `Producto ID: ${item.productId} - Cantidad: ${item.quantity} - Estado: ${order.status}`)
                .join('\n'))
                .join('\n');
        }
        if (normalizedMessage.includes('recomendar')) {
            const keyword = normalizedMessage.replace('recomendar', '').trim();
            const recommendations = await this.menuService.getItemsByKeyword(keyword);
            if (recommendations.length === 0) {
                return `No encontré platos relacionados con "${keyword}". ¿Quieres buscar algo más?`;
            }
            return recommendations
                .map((item) => `${item.name}: $${item.price} - ${item.description}`)
                .join('\n');
        }
        if (normalizedMessage.includes('horarios')) {
            return 'Estamos abiertos de lunes a domingo, de 12:00 a 22:00.';
        }
        return 'Lo siento, no entendí tu mensaje. Por favor, intenta de nuevo.';
    }
    formatMenuResponse(menuItems) {
        if (menuItems.length === 0) {
            return 'El menú está vacío por el momento.';
        }
        return menuItems
            .map((item) => `${item.name}: $${item.price} - ${item.description}`)
            .join('\n');
    }
    extractOrderDetails(message) {
        const orderRegex = /quiero\s+(\d+)\s+(.+)/i;
        const match = orderRegex.exec(message);
        if (!match) {
            return null;
        }
        const quantity = parseInt(match[1], 10);
        const itemName = match[2].trim();
        return { itemName, quantity };
    }
};
exports.ChatbotService = ChatbotService;
exports.ChatbotService = ChatbotService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [menu_service_1.MenuService,
        orders_service_1.OrderService])
], ChatbotService);
//# sourceMappingURL=chatbot.service.js.map