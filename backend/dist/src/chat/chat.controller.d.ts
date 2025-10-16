import { ChatService } from './chat.service';
export declare class ChatController {
    private chatService;
    constructor(chatService: ChatService);
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
    getPrivateMessages(receiverId: string, req: any): Promise<({
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
    sendMessage(messageData: any, req: any): Promise<{
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
