import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { MessageType } from '@prisma/client';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  async getGeneralMessages() {
    return this.prisma.message.findMany({
      where: { type: 'GENERAL' },
      include: {
        sender: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            role: true,
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  async getPrivateMessages(userId: number, receiverId: number) {
    return this.prisma.message.findMany({
      where: {
        OR: [
          {
            senderId: userId,
            receiverId: receiverId,
            type: 'PRIVADO',
          },
          {
            senderId: receiverId,
            receiverId: userId,
            type: 'PRIVADO',
          },
        ],
      },
      include: {
        sender: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  async sendMessage(messageData: {
    content: string;
    type: MessageType;
    senderId: number;
    receiverId?: number;
  }) {
    return this.prisma.message.create({
      data: messageData,
      include: {
        sender: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            role: true,
          },
        },
      },
    });
  }

  async getOnlineUsers() {
    // En una implementación real, usarías WebSockets para trackear usuarios online
    // Por ahora, devolvemos todos los usuarios activos
    return this.prisma.user.findMany({
      where: { isActive: true },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        role: true,
      },
    });
  }
}