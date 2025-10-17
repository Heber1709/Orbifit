import { PrismaService } from '../database/prisma.service';
export declare class CoachService {
    private prisma;
    constructor(prisma: PrismaService);
    getPlayers(coachId: number): Promise<{
        id: number;
        name: string;
        position: string;
    }[]>;
    getTeamStats(coachId: number): Promise<{
        activePlayers: number;
        trainings: number;
        matchesPlayed: number;
        wins: number;
    }>;
    getCoachProfile(coachId: number): Promise<{
        id: number;
        email: string;
        firstName: string;
        lastName: string;
        role: import(".prisma/client").$Enums.UserRole;
        phone: string;
        license: string;
        experienceYears: number;
        specialization: string;
    }>;
    getCoachTrainings(coachId: number): Promise<({
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
    createTraining(coachId: number, trainingData: any): Promise<{
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
    }>;
    updateTraining(trainingId: number, trainingData: any, coachId: number): Promise<{
        id: number;
        title: string;
        description: string | null;
        type: import(".prisma/client").$Enums.TrainingType;
        date: Date;
        duration: number;
        location: string | null;
        status: import(".prisma/client").$Enums.TrainingStatus;
        coachId: number;
    }>;
    deleteTraining(trainingId: number, coachId: number): Promise<{
        success: boolean;
        message: string;
    }>;
    saveTrainingResults(coachId: number, resultsData: any): Promise<{
        success: boolean;
        message: string;
        trainingId: any;
    }>;
    getTrainingResults(coachId: number, trainingId: number): Promise<{
        trainingId: number;
        players: any;
        generalObservations: string;
        rating: number;
        playerResults: ({
            player: {
                id: number;
                firstName: string;
                lastName: string;
                position: import(".prisma/client").$Enums.PlayerPosition;
            };
        } & {
            id: number;
            playerId: number;
            trainingId: number;
            endurance: number | null;
            technique: number | null;
            attitude: number | null;
            notes: string | null;
        })[];
    }>;
    deleteTrainingResults(coachId: number, trainingId: number): Promise<{
        success: boolean;
        message: string;
    }>;
    getAllTrainingResults(coachId: number): Promise<{
        trainingId: number;
        training: {
            id: number;
            title: string;
            type: import(".prisma/client").$Enums.TrainingType;
            date: Date;
        };
        players: any;
        playerResults: ({
            player: {
                firstName: string;
                lastName: string;
            };
        } & {
            id: number;
            playerId: number;
            trainingId: number;
            endurance: number | null;
            technique: number | null;
            attitude: number | null;
            notes: string | null;
        })[];
        generalObservations: string;
        rating: number;
        updatedAt: Date;
    }[]>;
    private mapRatingToNumber;
    private mapNumberToRating;
}
