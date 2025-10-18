import { CoachService } from './coach.service';
export declare class CoachController {
    private readonly coachService;
    constructor(coachService: CoachService);
    getPlayers(req: any): Promise<{
        id: number;
        name: string;
        position: string;
    }[]>;
    getTeamStats(req: any): Promise<{
        activePlayers: number;
        trainings: number;
        matchesPlayed: number;
        wins: number;
    }>;
    getCoachProfile(req: any): Promise<{
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
    getCoachTrainings(req: any): Promise<({
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
    createTraining(req: any, trainingData: any): Promise<{
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
    updateTraining(req: any, trainingId: number, trainingData: any): Promise<{
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
    deleteTraining(req: any, trainingId: number): Promise<{
        success: boolean;
        message: string;
    }>;
    saveTrainingResults(req: any, resultsData: any): Promise<{
        success: boolean;
        message: string;
        trainingId: any;
    }>;
    getTrainingResults(req: any, trainingId: number): Promise<{
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
    updateTrainingResults(req: any, trainingId: number, resultsData: any): Promise<{
        success: boolean;
        message: string;
        trainingId: any;
    }>;
    deleteTrainingResults(req: any, trainingId: number): Promise<{
        success: boolean;
        message: string;
    }>;
    getAllTrainingResults(req: any): Promise<{
        trainingId: number;
        training: {
            id: number;
            title: string;
            date: Date;
            type: import(".prisma/client").$Enums.TrainingType;
        };
        players: any;
        generalObservations: string;
        rating: number;
        updatedAt: Date;
    }[]>;
}
