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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let OrderService = class OrderService {
    constructor(orderModel, menuItemModel) {
        this.orderModel = orderModel;
        this.menuItemModel = menuItemModel;
    }
    async create(createOrderDto) {
        const itemsWithPrices = await Promise.all(createOrderDto.items.map(async (item) => {
            const menuItem = await this.menuItemModel
                .findById(item.productId)
                .exec();
            if (!menuItem) {
                throw new common_1.NotFoundException(`Menu item with ID ${item.productId} not found`);
            }
            return {
                ...item,
                price: menuItem.price,
            };
        }));
        const total = itemsWithPrices.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const order = new this.orderModel({
            customerName: createOrderDto.customerName,
            items: itemsWithPrices,
            total,
            status: createOrderDto.status || 'pending',
            createdAt: createOrderDto.createdAt || new Date(),
        });
        return order.save();
    }
    async getAllOrders() {
        return this.orderModel.find().exec();
    }
    async getOrderById(id) {
        const order = await this.orderModel.findById(id).exec();
        if (!order) {
            throw new common_1.NotFoundException(`Order with ID ${id} not found`);
        }
        return order;
    }
    async getActiveOrders() {
        const activeStatuses = ['pending', 'in_progress', 'completed'];
        return this.orderModel.find({ status: { $in: activeStatuses } }).exec();
    }
    async updateOrder(id, updateOrderDto) {
        let itemsWithPrices = [];
        let total = 0;
        if (updateOrderDto.items) {
            itemsWithPrices = await Promise.all(updateOrderDto.items.map(async (item) => {
                const menuItem = await this.menuItemModel
                    .findById(item.productId)
                    .exec();
                if (!menuItem) {
                    throw new common_1.NotFoundException(`Menu item with ID ${item.productId} not found`);
                }
                return {
                    ...item,
                    price: menuItem.price,
                };
            }));
            total = itemsWithPrices.reduce((sum, item) => sum + item.price * item.quantity, 0);
        }
        const updatedOrder = await this.orderModel
            .findByIdAndUpdate(id, {
            ...updateOrderDto,
            ...(updateOrderDto.items && { items: itemsWithPrices, total }),
        }, { new: true })
            .exec();
        if (!updatedOrder) {
            throw new common_1.NotFoundException(`Order with ID ${id} not found`);
        }
        return updatedOrder;
    }
    async deleteOrder(id) {
        const deletedOrder = await this.orderModel.findByIdAndDelete(id).exec();
        if (!deletedOrder) {
            throw new common_1.NotFoundException(`Order with ID ${id} not found`);
        }
        return deletedOrder;
    }
    async deleteAll() {
        await this.orderModel.deleteMany({}).exec();
    }
};
exports.OrderService = OrderService;
exports.OrderService = OrderService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('Order')),
    __param(1, (0, mongoose_1.InjectModel)('MenuItem')),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], OrderService);
//# sourceMappingURL=orders.service.js.map