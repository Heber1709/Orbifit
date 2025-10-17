import { ChatService } from './chat.service';
export declare class ChatController {
    private chatService;
    constructor(chatService: ChatService);
    getMessages(): Promise<({
        sender: {
            id: number;
            firstName: string;
            lastName: string;
            role: import(".prisma/client").$Enums.UserRole;
        };
        receiver: {
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
    sendMessage(req: any, messageData: any): Promise<{
        sender: {
            id: number;
            firstName: string;
            lastName: string;
            role: import(".prisma/client").$Enums.UserRole;
        };
        receiver: {
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
    getPrivateMessages(req: any, receiverId: number): Promise<({
        sender: {
            id: number;
            firstName: string;
            lastName: string;
            role: import(".prisma/client").$Enums.UserRole;
        };
        receiver: {
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
}
