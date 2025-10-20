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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const login_dto_1 = require("./dto/login.dto");
const register_dto_1 = require("./dto/register.dto");
const users_service_1 = require("../users/users.service");
let AuthController = class AuthController {
    constructor(authService, usersService) {
        this.authService = authService;
        this.usersService = usersService;
    }
    async login(loginDto) {
        return this.authService.login(loginDto);
    }
    async register(registerDto) {
        return this.authService.register(registerDto);
    }
    async forgotPassword(body) {
        try {
            console.log('📧 Solicitud de recuperación para:', body.email);
            const user = await this.usersService.findByEmail(body.email);
            const response = {
                success: true,
                message: 'Si el email existe en nuestro sistema, recibirás instrucciones de recuperación'
            };
            if (user) {
                response.developmentToken = 'dev-token-' + Date.now();
                response.developmentNote = 'En producción esto llegaría por email';
                console.log('✅ Usuario encontrado:', user.email);
            }
            else {
                console.log('⚠️ Email no encontrado:', body.email);
            }
            return response;
        }
        catch (error) {
            console.error('Error en forgot-password:', error);
            return {
                success: true,
                message: 'Si el email existe en nuestro sistema, recibirás instrucciones de recuperación'
            };
        }
    }
    async resetPassword(body) {
        try {
            console.log('🔄 Reset password con token:', body.token);
            if (body.token && body.token.startsWith('dev-token-')) {
                return {
                    success: true,
                    message: 'Contraseña actualizada correctamente (modo desarrollo)',
                    note: 'En producción, esto actualizaría la contraseña real del usuario'
                };
            }
            throw new Error('Token inválido');
        }
        catch (error) {
            throw new common_1.HttpException('Token inválido o expirado', common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async changePasswordDirectly(body) {
        try {
            console.log('🔐 Cambio directo de password para:', body.email);
            const user = await this.usersService.findByEmail(body.email);
            if (!user) {
                console.log('❌ Usuario no encontrado:', body.email);
                return {
                    success: true,
                    message: 'Si el email existe, la contraseña ha sido actualizada'
                };
            }
            console.log('✅ Usuario encontrado, actualizando contraseña...');
            await this.usersService.updatePassword(user.id, body.newPassword);
            console.log('✅ Contraseña actualizada para:', user.email);
            return {
                success: true,
                message: 'Contraseña actualizada correctamente',
                user: {
                    id: user.id,
                    email: user.email,
                    firstName: user.firstName
                }
            };
        }
        catch (error) {
            console.error('❌ Error actualizando contraseña:', error);
            throw new common_1.HttpException('Error al actualizar la contraseña', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.LoginDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('register'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [register_dto_1.RegisterDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('forgot-password'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "forgotPassword", null);
__decorate([
    (0, common_1.Post)('reset-password'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "resetPassword", null);
__decorate([
    (0, common_1.Post)('change-password'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "changePasswordDirectly", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        users_service_1.UsersService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map