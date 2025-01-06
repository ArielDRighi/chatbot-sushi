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
exports.MenuController = void 0;
const common_1 = require("@nestjs/common");
const menu_service_1 = require("./menu.service");
const menu_schema_1 = require("./menu.schema");
const roles_guard_1 = require("../auth/roles.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const user_roles_enum_1 = require("../users/user.roles.enum");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const swagger_1 = require("@nestjs/swagger");
let MenuController = class MenuController {
    constructor(menuService) {
        this.menuService = menuService;
    }
    getMenu() {
        return this.menuService.getAllItems();
    }
    getMenuItem(id) {
        return this.menuService.getItemById(id);
    }
    createMenuItem(menuItem) {
        return this.menuService.create(menuItem);
    }
    updateMenuItem(id, menuItem) {
        return this.menuService.update(id, menuItem);
    }
    deleteMenuItem(id) {
        return this.menuService.delete(id);
    }
};
exports.MenuController = MenuController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all menu items' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Return all menu items.' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MenuController.prototype, "getMenu", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a menu item by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Return a menu item.' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'The ID of the menu item' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MenuController.prototype, "getMenuItem", null);
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(user_roles_enum_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new menu item' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Menu item created successfully.' }),
    (0, swagger_1.ApiBody)({ type: menu_schema_1.MenuItem }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], MenuController.prototype, "createMenuItem", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, roles_decorator_1.Roles)(user_roles_enum_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Update a menu item by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Menu item updated successfully.' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'The ID of the menu item' }),
    (0, swagger_1.ApiBody)({ type: menu_schema_1.MenuItem }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], MenuController.prototype, "updateMenuItem", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(user_roles_enum_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a menu item by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Menu item deleted successfully.' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'The ID of the menu item' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MenuController.prototype, "deleteMenuItem", null);
exports.MenuController = MenuController = __decorate([
    (0, swagger_1.ApiTags)('menu'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('menu'),
    __metadata("design:paramtypes", [menu_service_1.MenuService])
], MenuController);
//# sourceMappingURL=menu.controller.js.map