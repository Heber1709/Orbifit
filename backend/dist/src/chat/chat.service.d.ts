import { PrismaService } from '../database/prisma.service';
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
    sendMessage(senderId: number, content: string): Promise<{
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
    getTeamMembers(currentUserId: number): Promise<{
        id: number;
        firstName: string;
        lastName: string;
        role: import(".prisma/client").$Enums.UserRole;
        position: import(".prisma/client").$Enums.PlayerPosition;
    }[]>;
}
