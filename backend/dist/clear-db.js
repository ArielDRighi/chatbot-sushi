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
    await menuService.deleteAll();
    await orderService.deleteAll();
    await app.close();
}
bootstrap();
//# sourceMappingURL=clear-db.js.map