import { PrismaService } from '../database/prisma.service';
export declare class CoachService {
    private prisma;
    constructor(prisma: PrismaService);
    getPlayers(coachId: number): Promise<{
        id: number;
        name: string;
        position: string;
        jerseyNumber: number;
        age: number;
    }[]>;
    getTeamStats(coachId: number): Promise<{
        activePlayers: number;
        trainings: number;
        matchesPlayed: number;
        wins: number;
        topPlayers: any[];
    }>;
    getCoachProfile(coachId: number): Promise<{
        id: number;
        email: string;
        username: string;
        firstName: string;
        lastName: string;
        role: import(".prisma/client").$Enums.UserRole;
        phone: string;
        license: string;
        experienceYears: number;
        specialization: string;
    }>;
}
