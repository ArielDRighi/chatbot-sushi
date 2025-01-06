"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const menu_service_1 = require("./menu/menu.service");
const orders_service_1 = require("./orders/orders.service");
const chatbot_service_1 = require("./chatbot/chatbot.service");
async function bootstrap() {
    const app = await core_1.NestFactory.createApplicationContext(app_module_1.AppModule);
    const menuService = app.get(menu_service_1.MenuService);
    const orderService = app.get(orders_service_1.OrderService);
    const chatbotService = app.get(chatbot_service_1.ChatbotService);
    const menuItems = [
        {
            name: 'Sushi de Salmón',
            description: 'Delicioso sushi de salmón fresco',
            price: 10.99,
            available: true,
        },
        {
            name: 'Sushi de Atún',
            description: 'Sushi de atún con un toque de wasabi',
            price: 12.99,
            available: true,
        },
        {
            name: 'Sushi de Camarón',
            description: 'Sushi de camarón con salsa especial',
            price: 11.99,
            available: true,
        },
    ];
    const insertedMenuItems = [];
    for (const item of menuItems) {
        const insertedItem = await menuService.create(item);
        insertedMenuItems.push(insertedItem);
    }
    const orders = [
        {
            customerName: 'Juan Pérez',
            items: [
                { productId: insertedMenuItems[0]._id, quantity: 2 },
                { productId: insertedMenuItems[1]._id, quantity: 1 },
            ],
            status: 'completed',
            createdAt: new Date(),
        },
        {
            customerName: 'María López',
            items: [{ productId: insertedMenuItems[2]._id, quantity: 3 }],
            status: 'pending',
            createdAt: new Date(),
        },
    ];
    for (const order of orders) {
        const itemsWithPrices = await Promise.all(order.items.map(async (item) => {
            const menuItem = await menuService.getItemById(item.productId);
            return {
                ...item,
                price: menuItem.price,
            };
        }));
        const total = itemsWithPrices.reduce((sum, item) => sum + item.price * item.quantity, 0);
        await orderService.create({
            ...order,
            items: itemsWithPrices,
            total,
        });
    }
    await app.close();
}
bootstrap();
//# sourceMappingURL=seed.js.map