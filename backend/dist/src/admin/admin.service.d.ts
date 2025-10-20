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
    generateReports(): Promise<{
        userStats: {
            byRole: (import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.UserGroupByOutputType, "role"[]> & {
                _count: {
                    id: number;
                };
            })[];
            byStatus: (import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.UserGroupByOutputType, "isActive"[]> & {
                _count: {
                    id: number;
                };
            })[];
            newThisMonth: number;
            total: number;
        };
        trainingStats: {
            byType: (import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.TrainingGroupByOutputType, "type"[]> & {
                _count: {
                    id: number;
                };
            })[];
            monthly: any;
            total: number;
            active: number;
        };
        tournamentStats: {
            byStatus: (import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.TournamentGroupByOutputType, "status"[]> & {
                _count: {
                    id: number;
                };
            })[];
            total: number;
        };
        systemStats: {
            generatedAt: string;
            storageUsed: string;
        };
        generatedAt: string;
    }>;
    private getMonthlyTrainings;
    private calculateStorageUsage;
    private mapRoleToSpanish;
    private mapRoleToEnglish;
}
