import { CoachService } from './coach.service';
export declare class CoachController {
    private readonly coachService;
    constructor(coachService: CoachService);
    getPlayers(req: any): Promise<{
        id: number;
        name: string;
        position: string;
        jerseyNumber: number;
        age: number;
    }[]>;
    getTeamStats(req: any): Promise<{
        activePlayers: number;
        trainings: number;
        matchesPlayed: number;
        wins: number;
        topPlayers: any[];
    }>;
    getCoachProfile(req: any): Promise<{
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
