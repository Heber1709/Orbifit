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
}
