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
exports.TournamentService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../database/prisma.service");
let TournamentService = class TournamentService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getAllTournaments() {
        try {
            const tournaments = await this.prisma.tournament.findMany({
                orderBy: {
                    startDate: 'asc'
                }
            });
            return tournaments;
        }
        catch (error) {
            console.error('Error getting tournaments:', error);
            throw new Error('Error al obtener torneos');
        }
    }
    async createTournament(tournamentData) {
        try {
            const { name, description, startDate, endDate, teamsCount } = tournamentData;
            const tournament = await this.prisma.tournament.create({
                data: {
                    name,
                    description,
                    startDate: new Date(startDate),
                    endDate: endDate ? new Date(endDate) : null,
                    teamsCount: teamsCount || 0,
                    status: 'ACTIVO'
                }
            });
            return tournament;
        }
        catch (error) {
            console.error('Error creating tournament:', error);
            throw new Error('Error al crear torneo: ' + error.message);
        }
    }
    async updateTournament(tournamentId, tournamentData) {
        try {
            const updatedTournament = await this.prisma.tournament.update({
                where: { id: tournamentId },
                data: {
                    ...tournamentData,
                    startDate: tournamentData.startDate ? new Date(tournamentData.startDate) : undefined,
                    endDate: tournamentData.endDate ? new Date(tournamentData.endDate) : undefined,
                }
            });
            return updatedTournament;
        }
        catch (error) {
            console.error('Error updating tournament:', error);
            throw new Error('Error al actualizar torneo: ' + error.message);
        }
    }
    async deleteTournament(tournamentId) {
        try {
            await this.prisma.tournament.delete({
                where: { id: tournamentId }
            });
            return {
                success: true,
                message: 'Torneo eliminado correctamente'
            };
        }
        catch (error) {
            console.error('Error deleting tournament:', error);
            throw new Error('Error al eliminar torneo: ' + error.message);
        }
    }
    async getTournamentStats() {
        try {
            const totalTournaments = await this.prisma.tournament.count();
            const activeTournaments = await this.prisma.tournament.count({
                where: { status: 'ACTIVO' }
            });
            const scheduledTournaments = await this.prisma.tournament.count({
                where: { status: 'PROGRAMADO' }
            });
            const finishedTournaments = await this.prisma.tournament.count({
                where: { status: 'FINALIZADO' }
            });
            return {
                totalTournaments,
                activeTournaments,
                scheduledTournaments,
                finishedTournaments
            };
        }
        catch (error) {
            console.error('Error getting tournament stats:', error);
            throw new Error('Error al obtener estadísticas de torneos');
        }
    }
};
exports.TournamentService = TournamentService;
exports.TournamentService = TournamentService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TournamentService);
//# sourceMappingURL=tournament.service.js.map