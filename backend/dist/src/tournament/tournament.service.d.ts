import { PrismaService } from '../database/prisma.service';
export declare class TournamentService {
    private prisma;
    constructor(prisma: PrismaService);
    getAllTournaments(): Promise<{
        id: number;
        name: string;
        description: string | null;
        status: import(".prisma/client").$Enums.TournamentStatus;
        startDate: Date;
        endDate: Date | null;
        teamsCount: number;
    }[]>;
    createTournament(tournamentData: any): Promise<{
        id: number;
        name: string;
        description: string | null;
        status: import(".prisma/client").$Enums.TournamentStatus;
        startDate: Date;
        endDate: Date | null;
        teamsCount: number;
    }>;
    updateTournament(tournamentId: number, tournamentData: any): Promise<{
        id: number;
        name: string;
        description: string | null;
        status: import(".prisma/client").$Enums.TournamentStatus;
        startDate: Date;
        endDate: Date | null;
        teamsCount: number;
    }>;
    deleteTournament(tournamentId: number): Promise<{
        success: boolean;
        message: string;
    }>;
    getTournamentStats(): Promise<{
        totalTournaments: number;
        activeTournaments: number;
        scheduledTournaments: number;
        finishedTournaments: number;
    }>;
}
