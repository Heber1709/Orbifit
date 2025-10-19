import { PlayerService } from './player.service';
export declare class PlayerController {
    private readonly playerService;
    constructor(playerService: PlayerService);
    getPlayerTrainings(req: any): Promise<({
        coach: {
            id: number;
            firstName: string;
            lastName: string;
        };
        participants: ({
            player: {
                id: number;
                firstName: string;
                lastName: string;
            };
        } & {
            id: number;
            confirmed: boolean;
            attended: boolean | null;
            playerId: number;
            trainingId: number;
        })[];
    } & {
        id: number;
        title: string;
        description: string | null;
        type: import(".prisma/client").$Enums.TrainingType;
        date: Date;
        duration: number;
        location: string | null;
        status: import(".prisma/client").$Enums.TrainingStatus;
        coachId: number;
    })[]>;
    getPlayerStats(req: any): Promise<{
        trainingsCompleted: number;
        totalTrainings: number;
        matchesPlayed: number;
        goals: number;
        assists: number;
        nextMatch: string;
    }>;
    getPlayerPerformance(req: any): Promise<{
        endurance: number;
        technique: number;
        attitude: number;
        overall: number;
        totalTrainings: number;
        lastTraining: Date;
    }>;
    debugEndpoint(req: any): Promise<{
        message: string;
        user: string;
        userId: any;
        allTrainingsCount: number;
        playerTrainingsCount: number;
        allTrainings: {
            id: number;
            title: string;
            date: Date;
            participants: string[];
        }[];
        playerTrainings: {
            id: number;
            title: string;
            date: Date;
            participants: string[];
        }[];
    }>;
}
