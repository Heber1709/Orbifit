import { UsersService } from './users.service';
export declare class UsersController {
    private usersService;
    constructor(usersService: UsersService);
    getProfile(req: any): Promise<{
        id: number;
        email: string;
        username: string;
        firstName: string;
        lastName: string;
        role: import(".prisma/client").$Enums.UserRole;
        age: number | null;
        position: import(".prisma/client").$Enums.PlayerPosition | null;
        phone: string | null;
        jerseyNumber: number | null;
        license: string | null;
        experienceYears: number | null;
        specialization: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateProfile(req: any, updateData: any): Promise<{
        id: number;
        email: string;
        username: string;
        firstName: string;
        lastName: string;
        role: import(".prisma/client").$Enums.UserRole;
        age: number;
        position: import(".prisma/client").$Enums.PlayerPosition;
        phone: string;
        jerseyNumber: number;
        license: string;
        experienceYears: number;
        specialization: string;
    }>;
    getCoaches(): Promise<{
        id: number;
        email: string;
        firstName: string;
        lastName: string;
        experienceYears: number;
        specialization: string;
    }[]>;
    getPlayers(): Promise<{
        id: number;
        email: string;
        firstName: string;
        lastName: string;
        age: number;
        position: import(".prisma/client").$Enums.PlayerPosition;
        jerseyNumber: number;
    }[]>;
    getAllUsers(): Promise<{
        id: number;
        email: string;
        username: string;
        firstName: string;
        lastName: string;
        role: import(".prisma/client").$Enums.UserRole;
        age: number;
        position: import(".prisma/client").$Enums.PlayerPosition;
        phone: string;
        jerseyNumber: number;
        isActive: boolean;
        createdAt: Date;
    }[]>;
}
