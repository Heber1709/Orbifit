import { CalendarService } from './calendar.service';
export declare class CalendarController {
    private calendarService;
    constructor(calendarService: CalendarService);
    getEvents(year: string, month: string): Promise<({
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
    createEvent(eventData: any, req: any): Promise<{
        id: number;
        title: string;
        description: string | null;
        type: import(".prisma/client").$Enums.EventType;
        date: Date;
        location: string | null;
        time: string | null;
        createdById: number;
    }>;
}
