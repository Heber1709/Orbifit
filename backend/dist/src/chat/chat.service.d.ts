import { PrismaService } from '../database/prisma.service';
import { MessageType } from '@prisma/client';
export declare class ChatService {
    private prisma;
    constructor(prisma: PrismaService);
    getGeneralMessages(): Promise<({
        sender: {
            id: number;
            firstName: string;
            lastName: string;
            role: import(".prisma/client").$Enums.UserRole;
        };
    } & {
        id: number;
        createdAt: Date;
        type: import(".prisma/client").$Enums.MessageType;
        content: string;
        senderId: number;
        receiverId: number | null;
    })[]>;
    getPrivateMessages(userId: number, receiverId: number): Promise<({
        sender: {
            id: number;
            firstName: string;
            lastName: string;
        };
    } & {
        id: number;
        createdAt: Date;
        type: import(".prisma/client").$Enums.MessageType;
        content: string;
        senderId: number;
        receiverId: number | null;
    })[]>;
    sendMessage(messageData: {
        content: string;
        type: MessageType;
        senderId: number;
        receiverId?: number;
    }): Promise<{
        sender: {
            id: number;
            firstName: string;
            lastName: string;
            role: import(".prisma/client").$Enums.UserRole;
        };
    } & {
        id: number;
        createdAt: Date;
        type: import(".prisma/client").$Enums.MessageType;
        content: string;
        senderId: number;
        receiverId: number | null;
    }>;
    getOnlineUsers(): Promise<{
        id: number;
        firstName: string;
        lastName: string;
        role: import(".prisma/client").$Enums.UserRole;
    }[]>;
}
