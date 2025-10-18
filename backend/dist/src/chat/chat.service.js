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
exports.ChatService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../database/prisma.service");
let ChatService = class ChatService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getGeneralMessages() {
        try {
            const messages = await this.prisma.message.findMany({
                where: {
                    type: 'GENERAL',
                    receiverId: null
                },
                orderBy: { createdAt: 'asc' },
                include: {
                    sender: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            role: true,
                        },
                    }
                },
            });
            return messages;
        }
        catch (error) {
            console.error('Error getting general messages:', error);
            return [];
        }
    }
    async sendMessage(senderId, content) {
        try {
            const message = await this.prisma.message.create({
                data: {
                    content: content.trim(),
                    senderId: senderId,
                    type: 'GENERAL',
                },
                include: {
                    sender: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            role: true,
                        },
                    }
                },
            });
            return message;
        }
        catch (error) {
            console.error('Error sending message:', error);
            throw new Error('Error al enviar el mensaje');
        }
    }
    async getTeamMembers(currentUserId) {
        try {
            const members = await this.prisma.user.findMany({
                where: {
                    id: { not: currentUserId },
                    isActive: true
                },
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    role: true,
                    position: true,
                },
                orderBy: {
                    firstName: 'asc'
                }
            });
            return members;
        }
        catch (error) {
            console.error('Error getting team members:', error);
            return [];
        }
    }
};
exports.ChatService = ChatService;
exports.ChatService = ChatService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ChatService);
//# sourceMappingURL=chat.service.js.map