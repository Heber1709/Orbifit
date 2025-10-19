import { TournamentService } from './tournament.service';
export declare class TournamentController {
    private readonly tournamentService;
    constructor(tournamentService: TournamentService);
    getAllTournaments(req: any): Promise<{
        id: number;
        name: string;
        description: string | null;
        status: import(".prisma/client").$Enums.TournamentStatus;
        startDate: Date;
        endDate: Date | null;
        teamsCount: number;
    }[]>;
    createTournament(req: any, tournamentData: any): Promise<{
        id: number;
        name: string;
        description: string | null;
        status: import(".prisma/client").$Enums.TournamentStatus;
        startDate: Date;
        endDate: Date | null;
        teamsCount: number;
    }>;
    updateTournament(req: any, tournamentId: number, tournamentData: any): Promise<{
        id: number;
        name: string;
        description: string | null;
        status: import(".prisma/client").$Enums.TournamentStatus;
        startDate: Date;
        endDate: Date | null;
        teamsCount: number;
    }>;
    deleteTournament(req: any, tournamentId: number): Promise<{
        success: boolean;
        message: string;
    }>;
    getTournamentStats(req: any): Promise<{
        totalTournaments: number;
        activeTournaments: number;
        scheduledTournaments: number;
        finishedTournaments: number;
    }>;
}
