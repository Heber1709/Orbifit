import { PrismaService } from '../database/prisma.service';
export declare class AdminService {
    private prisma;
    constructor(prisma: PrismaService);
    getSystemStats(): Promise<{
        totalUsers: number;
        totalPlayers: number;
        totalCoaches: number;
        totalAdmins: number;
        activeTrainings: number;
        totalTournaments: number;
    }>;
    getAllUsers(): Promise<{
        role: string;
        status: string;
        id: number;
        email: string;
        username: string;
        firstName: string;
        lastName: string;
        position: import(".prisma/client").$Enums.PlayerPosition;
        phone: string;
        isActive: boolean;
        createdAt: Date;
    }[]>;
    createUser(userData: any): Promise<{
        role: string;
        status: string;
        id: number;
        email: string;
        username: string;
        firstName: string;
        lastName: string;
        phone: string;
        isActive: boolean;
        createdAt: Date;
    }>;
    updateUser(userId: number, userData: any): Promise<{
        role: string;
        status: string;
        id: number;
        email: string;
        username: string;
        firstName: string;
        lastName: string;
        position: import(".prisma/client").$Enums.PlayerPosition;
        phone: string;
        isActive: boolean;
        createdAt: Date;
    }>;
    deleteUser(userId: number): Promise<{
        role: string;
        status: string;
        message: string;
        id: number;
        email: string;
        username: string;
        firstName: string;
        lastName: string;
        phone: string;
        isActive: boolean;
        createdAt: Date;
    }>;
    private mapRoleToSpanish;
    private mapRoleToEnglish;
}
