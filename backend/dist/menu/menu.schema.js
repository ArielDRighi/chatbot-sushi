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
exports.MenuItemSchema = exports.MenuItem = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const swagger_1 = require("@nestjs/swagger");
let MenuItem = class MenuItem extends mongoose_2.Document {
};
exports.MenuItem = MenuItem;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Sushi de Salmón',
        description: 'The name of the menu item',
    }),
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], MenuItem.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Delicious salmon sushi',
        description: 'The description of the menu item',
    }),
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], MenuItem.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 10.99, description: 'The price of the menu item' }),
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], MenuItem.prototype, "price", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true, description: 'Availability of the menu item' }),
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Boolean)
], MenuItem.prototype, "available", void 0);
exports.MenuItem = MenuItem = __decorate([
    (0, mongoose_1.Schema)()
], MenuItem);
exports.MenuItemSchema = mongoose_1.SchemaFactory.createForClass(MenuItem);
//# sourceMappingURL=menu.schema.js.map