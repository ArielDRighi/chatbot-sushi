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
exports.MenuDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class MenuDto {
}
exports.MenuDto = MenuDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Sushi de Salmón',
        description: 'The name of the menu item',
    }),
    __metadata("design:type", String)
], MenuDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Delicious salmon sushi',
        description: 'The description of the menu item',
    }),
    __metadata("design:type", String)
], MenuDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 10.99, description: 'The price of the menu item' }),
    __metadata("design:type", Number)
], MenuDto.prototype, "price", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true, description: 'Availability of the menu item' }),
    __metadata("design:type", Boolean)
], MenuDto.prototype, "available", void 0);
//# sourceMappingURL=menu.dto.js.map