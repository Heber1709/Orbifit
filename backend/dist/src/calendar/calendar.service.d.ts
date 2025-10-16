import { PrismaService } from '../database/prisma.service';
import { EventType } from '@prisma/client';
export declare class CalendarService {
    private prisma;
    constructor(prisma: PrismaService);
    getEvents(year: number, month: number): Promise<({
        createdBy: {
            firstName: string;
            lastName: string;
        };
    } & {
        id: number;
        title: string;
        description: string | null;
        type: import(".prisma/client").$Enums.EventType;
        date: Date;
        location: string | null;
        time: string | null;
        createdById: number;
    })[]>;
    createEvent(eventData: {
        title: string;
        description?: string;
        type: EventType;
        date: Date;
        time?: string;
        location?: string;
        createdById: number;
    }): Promise<{
        id: number;
        title: string;
        description: string | null;
        type: import(".prisma/client").$Enums.EventType;
        date: Date;
        location: string | null;
        time: string | null;
        createdById: number;
    }>;
    getEventsByDate(date: string): Promise<({
        createdBy: {
            firstName: string;
            lastName: string;
        };
    } & {
        id: number;
        title: string;
        description: string | null;
        type: import(".prisma/client").$Enums.EventType;
        date: Date;
        location: string | null;
        time: string | null;
        createdById: number;
    })[]>;
}
