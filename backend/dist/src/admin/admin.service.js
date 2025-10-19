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
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../database/prisma.service");
const bcrypt = require("bcryptjs");
let AdminService = class AdminService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getSystemStats() {
        try {
            const totalUsers = await this.prisma.user.count();
            const totalPlayers = await this.prisma.user.count({
                where: {
                    role: 'JUGADOR'
                }
            });
            const totalCoaches = await this.prisma.user.count({
                where: {
                    role: 'ENTRENADOR'
                }
            });
            const totalAdmins = await this.prisma.user.count({
                where: {
                    role: 'ADMINISTRADOR'
                }
            });
            const activeTrainings = await this.prisma.training.count({
                where: {
                    date: { gte: new Date() }
                }
            });
            const totalTournaments = 0;
            return {
                totalUsers,
                totalPlayers,
                totalCoaches,
                totalAdmins,
                activeTrainings,
                totalTournaments
            };
        }
        catch (error) {
            console.error('Error getting system stats:', error);
            throw new Error('Error al obtener estadísticas del sistema');
        }
    }
    async getAllUsers() {
        try {
            const users = await this.prisma.user.findMany({
                select: {
                    id: true,
                    email: true,
                    firstName: true,
                    lastName: true,
                    role: true,
                    position: true,
                    isActive: true,
                    createdAt: true,
                    username: true,
                    phone: true
                },
                orderBy: {
                    createdAt: 'desc'
                }
            });
            return users.map(user => ({
                ...user,
                role: this.mapRoleToSpanish(user.role),
                status: user.isActive ? 'active' : 'inactive'
            }));
        }
        catch (error) {
            console.error('Error getting all users:', error);
            throw new Error('Error al obtener usuarios');
        }
    }
    async createUser(userData) {
        try {
            const { firstName, lastName, email, role, password, username, phone } = userData;
            const existingUser = await this.prisma.user.findUnique({
                where: { email }
            });
            if (existingUser) {
                throw new Error('El usuario ya existe');
            }
            const finalUsername = username || email.split('@')[0];
            const finalRole = this.mapRoleToEnglish(role);
            const hashedPassword = await bcrypt.hash(password, 10);
            const userDataForCreate = {
                username: finalUsername,
                email,
                firstName,
                lastName,
                role: finalRole,
                password: hashedPassword,
                isActive: true,
                phone: phone || null
            };
            if (finalRole === 'JUGADOR') {
                userDataForCreate.position = 'MEDIOCAMPO';
                userDataForCreate.age = 20;
                userDataForCreate.jerseyNumber = 99;
            }
            else if (finalRole === 'ENTRENADOR') {
                userDataForCreate.specialization = 'General';
                userDataForCreate.experienceYears = 1;
                userDataForCreate.license = 'Nacional';
            }
            const user = await this.prisma.user.create({
                data: userDataForCreate,
                select: {
                    id: true,
                    email: true,
                    firstName: true,
                    lastName: true,
                    role: true,
                    isActive: true,
                    createdAt: true,
                    username: true,
                    phone: true
                }
            });
            return {
                ...user,
                role: this.mapRoleToSpanish(user.role),
                status: 'active'
            };
        }
        catch (error) {
            console.error('Error creating user:', error);
            throw new Error('Error al crear usuario: ' + error.message);
        }
    }
    async updateUser(userId, userData) {
        try {
            if (userData.role) {
                userData.role = this.mapRoleToEnglish(userData.role);
            }
            const updatedUser = await this.prisma.user.update({
                where: { id: userId },
                data: userData,
                select: {
                    id: true,
                    email: true,
                    firstName: true,
                    lastName: true,
                    role: true,
                    isActive: true,
                    createdAt: true,
                    username: true,
                    phone: true,
                    position: true
                }
            });
            return {
                ...updatedUser,
                role: this.mapRoleToSpanish(updatedUser.role),
                status: updatedUser.isActive ? 'active' : 'inactive'
            };
        }
        catch (error) {
            console.error('Error updating user:', error);
            throw new Error('Error al actualizar usuario: ' + error.message);
        }
    }
    async deleteUser(userId) {
        try {
            console.log('🔄 Desactivando usuario ID:', userId);
            const updatedUser = await this.prisma.user.update({
                where: { id: userId },
                data: {
                    isActive: false,
                    email: `deleted_${Date.now()}_${userId}@deleted.com`,
                    username: `deleted_${Date.now()}_${userId}`
                },
                select: {
                    id: true,
                    email: true,
                    firstName: true,
                    lastName: true,
                    role: true,
                    isActive: true,
                    createdAt: true,
                    username: true,
                    phone: true
                }
            });
            console.log('✅ Usuario desactivado:', updatedUser);
            return {
                ...updatedUser,
                role: this.mapRoleToSpanish(updatedUser.role),
                status: 'inactive',
                message: 'Usuario desactivado correctamente. Ya no podrá acceder al sistema.'
            };
        }
        catch (error) {
            console.error('❌ Error desactivando usuario:', error);
            if (error.code === 'P2003' || error.code === 'P2014') {
                console.log('⚠️ Usuario tiene datos relacionados, intentando solo desactivar...');
                try {
                    const updatedUser = await this.prisma.user.update({
                        where: { id: userId },
                        data: {
                            isActive: false
                        },
                        select: {
                            id: true,
                            email: true,
                            firstName: true,
                            lastName: true,
                            role: true,
                            isActive: true,
                            createdAt: true,
                            username: true,
                            phone: true
                        }
                    });
                    return {
                        ...updatedUser,
                        role: this.mapRoleToSpanish(updatedUser.role),
                        status: 'inactive',
                        message: 'Usuario desactivado correctamente (se mantuvo el email por datos relacionados).'
                    };
                }
                catch (secondError) {
                    console.error('❌ Error en segundo intento:', secondError);
                    throw new Error('Error al desactivar usuario: ' + secondError.message);
                }
            }
            throw new Error('Error al desactivar usuario: ' + error.message);
        }
    }
    mapRoleToSpanish(role) {
        const roleMap = {
            'ADMINISTRADOR': 'administrador',
            'ENTRENADOR': 'entrenador',
            'JUGADOR': 'jugador'
        };
        return roleMap[role] || role.toLowerCase();
    }
    mapRoleToEnglish(role) {
        const roleMap = {
            'administrador': 'ADMINISTRADOR',
            'entrenador': 'ENTRENADOR',
            'jugador': 'JUGADOR'
        };
        return roleMap[role] || role.toUpperCase();
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AdminService);
//# sourceMappingURL=admin.service.js.map