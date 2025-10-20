import { AdminService } from './admin.service';
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
    getSystemStats(req: any): Promise<{
        totalUsers: number;
        totalPlayers: number;
        totalCoaches: number;
        totalAdmins: number;
        activeTrainings: number;
        totalTournaments: number;
    }>;
    getAllUsers(req: any): Promise<{
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
    createUser(req: any, userData: any): Promise<{
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
    updateUser(req: any, userId: number, userData: any): Promise<{
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
    deleteUser(req: any, userId: number): Promise<{
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
    generateReports(req: any): Promise<{
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
            uptime: string;
        };
        generatedAt: string;
    }>;
}
