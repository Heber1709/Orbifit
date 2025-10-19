import { PrismaService } from '../database/prisma.service';
export declare class PlayerService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    getPlayerTrainings(playerId: number): Promise<({
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
    getPlayerStats(playerId: number): Promise<{
        trainingsCompleted: number;
        totalTrainings: number;
        matchesPlayed: number;
        goals: number;
        assists: number;
        nextMatch: string;
    }>;
    getPlayerPerformance(playerId: number): Promise<{
        endurance: number;
        technique: number;
        attitude: number;
        overall: number;
        totalTrainings: number;
        lastTraining: Date;
    }>;
}
