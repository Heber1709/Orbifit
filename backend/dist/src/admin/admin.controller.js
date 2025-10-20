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
exports.AdminController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const admin_service_1 = require("./admin.service");
let AdminController = class AdminController {
    constructor(adminService) {
        this.adminService = adminService;
    }
    async getSystemStats(req) {
        console.log('📊 GET /admin/stats - Admin ID:', req.user?.userId);
        if (req.user?.role !== 'ADMINISTRADOR') {
            throw new Error('No autorizado');
        }
        return this.adminService.getSystemStats();
    }
    async getAllUsers(req) {
        console.log('👥 GET /admin/users - Admin ID:', req.user?.userId);
        if (req.user?.role !== 'ADMINISTRADOR') {
            throw new Error('No autorizado');
        }
        return this.adminService.getAllUsers();
    }
    async createUser(req, userData) {
        console.log('✅ POST /admin/users - Admin ID:', req.user?.userId);
        console.log('📝 Datos usuario:', userData);
        if (req.user?.role !== 'ADMINISTRADOR') {
            throw new Error('No autorizado');
        }
        return this.adminService.createUser(userData);
    }
    async updateUser(req, userId, userData) {
        console.log('🔄 PUT /admin/users/:id - ID:', userId);
        console.log('📝 Datos:', userData);
        if (req.user?.role !== 'ADMINISTRADOR') {
            throw new Error('No autorizado');
        }
        return this.adminService.updateUser(userId, userData);
    }
    async deleteUser(req, userId) {
        console.log('🗑️ DELETE /admin/users/:id - ID:', userId);
        if (req.user?.role !== 'ADMINISTRADOR') {
            throw new Error('No autorizado');
        }
        return this.adminService.deleteUser(userId);
    }
    async generateReports(req) {
        console.log('📈 GET /admin/reports - Admin ID:', req.user?.userId);
        if (req.user?.role !== 'ADMINISTRADOR') {
            throw new Error('No autorizado');
        }
        return this.adminService.generateReports();
    }
};
exports.AdminController = AdminController;
__decorate([
    (0, common_1.Get)('stats'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getSystemStats", null);
__decorate([
    (0, common_1.Get)('users'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getAllUsers", null);
__decorate([
    (0, common_1.Post)('users'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "createUser", null);
__decorate([
    (0, common_1.Put)('users/:id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updateUser", null);
__decorate([
    (0, common_1.Delete)('users/:id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "deleteUser", null);
__decorate([
    (0, common_1.Get)('reports'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "generateReports", null);
exports.AdminController = AdminController = __decorate([
    (0, common_1.Controller)('admin'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __metadata("design:paramtypes", [admin_service_1.AdminService])
], AdminController);
//# sourceMappingURL=admin.controller.js.map