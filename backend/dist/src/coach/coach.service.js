"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoachService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../database/prisma.service");
let CoachService = class CoachService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getPlayers(coachId) {
        try {
            const players = await this.prisma.user.findMany({
                where: {
                    role: 'JUGADOR',
                    isActive: true
                },
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    position: true,
                    jerseyNumber: true,
                    age: true
                },
                orderBy: {
                    firstName: 'asc'
                }
            });
            const formattedPlayers = players.map(player => ({
                id: player.id,
                name: `${player.firstName} ${player.lastName}`,
                position: player.position || 'Sin posición',
                jerseyNumber: player.jerseyNumber,
                age: player.age
            }));
            return formattedPlayers;
        }
        catch (error) {
            throw new Error('Error al cargar los jugadores');
        }
    }
    async getTeamStats(coachId) {
        try {
            const activePlayers = await this.prisma.user.count({
                where: {
                    role: 'JUGADOR',
                    isActive: true
                }
            });
            const trainings = await this.prisma.training.count({
                where: { coachId }
            });
            return {
                activePlayers,
                trainings,
                matchesPlayed: 0,
                wins: 0,
                topPlayers: []
            };
        }
        catch (error) {
            throw new Error('Error al cargar las estadísticas');
        }
    }
    async getCoachProfile(coachId) {
        try {
            const coach = await this.prisma.user.findUnique({
                where: { id: coachId },
                select: {
                    id: true,
                    email: true,
                    username: true,
                    firstName: true,
                    lastName: true,
                    role: true,
                    phone: true,
                    license: true,
                    experienceYears: true,
                    specialization: true
                }
            });
            if (!coach) {
                throw new Error('Entrenador no encontrado');
            }
            return coach;
        }
        catch (error) {
            throw new Error('Error al cargar el perfil del entrenador');
        }
    }
};
exports.CoachService = CoachService;
exports.CoachService = CoachService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CoachService);
//# sourceMappingURL=coach.service.js.map