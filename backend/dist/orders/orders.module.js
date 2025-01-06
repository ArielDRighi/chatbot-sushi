"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const orders_controller_1 = require("./orders.controller");
const orders_service_1 = require("./orders.service");
const order_schema_1 = require("./order.schema");
const menu_module_1 = require("../menu/menu.module");
const auth_module_1 = require("../auth/auth.module");
let OrderModule = class OrderModule {
};
exports.OrderModule = OrderModule;
exports.OrderModule = OrderModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: 'Order', schema: order_schema_1.OrderSchema }]),
            menu_module_1.MenuModule,
            auth_module_1.AuthModule,
        ],
        controllers: [orders_controller_1.OrderController],
        providers: [orders_service_1.OrderService],
        exports: [orders_service_1.OrderService, mongoose_1.MongooseModule],
    })
], OrderModule);
//# sourceMappingURL=orders.module.js.map