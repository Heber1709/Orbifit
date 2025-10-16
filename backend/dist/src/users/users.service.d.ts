import { PrismaService } from '../database/prisma.service';
import { User, UserRole, PlayerPosition } from '@prisma/client';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    findByEmail(email: string): Promise<User | null>;
    findByUsername(username: string): Promise<User | null>;
    findById(id: number): Promise<User | null>;
    create(userData: {
        email: string;
        username: string;
        password: string;
        firstName: string;
        lastName: string;
        role?: UserRole;
        age?: number;
        position?: PlayerPosition;
        phone?: string;
        jerseyNumber?: number;
    }): Promise<User>;
    findAll(role?: UserRole): Promise<{
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
    updateProfile(id: number, updateData: any): Promise<{
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
}
