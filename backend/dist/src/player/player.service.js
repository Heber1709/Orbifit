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
var PlayerService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../database/prisma.service");
let PlayerService = PlayerService_1 = class PlayerService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(PlayerService_1.name);
    }
    async getPlayerTrainings(playerId) {
        this.logger.log(`🎯 Buscando entrenamientos para jugador ID: ${playerId}`);
        try {
            const player = await this.prisma.user.findUnique({
                where: { id: playerId }
            });
            if (!player) {
                this.logger.error(`❌ Jugador no encontrado con ID: ${playerId}`);
                return [];
            }
            this.logger.log(`👤 Jugador encontrado: ${player.firstName} ${player.lastName}`);
            const trainings = await this.prisma.training.findMany({
                where: {
                    participants: {
                        some: {
                            playerId: playerId
                        }
                    }
                },
                include: {
                    participants: {
                        include: {
                            player: {
                                select: {
                                    id: true,
                                    firstName: true,
                                    lastName: true
                                }
                            }
                        }
                    },
                    coach: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true
                        }
                    }
                },
                orderBy: {
                    date: 'asc'
                }
            });
            this.logger.log(`✅ Encontrados ${trainings.length} entrenamientos para el jugador`);
            trainings.forEach(training => {
                this.logger.log(`📅 Entrenamiento: ${training.title} - ${training.date} - Participantes: ${training.participants.length}`);
            });
            return trainings;
        }
        catch (error) {
            this.logger.error(`❌ Error buscando entrenamientos: ${error.message}`);
            return [];
        }
    }
    async getPlayerStats(playerId) {
        try {
            const trainingsCount = await this.prisma.training.count({
                where: {
                    participants: {
                        some: {
                            playerId: playerId
                        }
                    }
                }
            });
            return {
                matchesPlayed: trainingsCount,
                goals: 0,
                assists: 0,
                nextMatch: 'Por programar'
            };
        }
        catch (error) {
            this.logger.error(`❌ Error obteniendo estadísticas: ${error.message}`);
            return {
                matchesPlayed: 0,
                goals: 0,
                assists: 0,
                nextMatch: 'Por programar'
            };
        }
    }
    async getPlayerPerformance(playerId) {
        try {
            const results = await this.prisma.trainingResult.findMany({
                where: {
                    playerId: playerId
                },
                include: {
                    training: {
                        select: {
                            id: true,
                            title: true,
                            date: true
                        }
                    }
                },
                orderBy: {
                    training: {
                        date: 'desc'
                    }
                }
            });
            if (results.length === 0) {
                return null;
            }
            let totalEndurance = 0;
            let totalTechnique = 0;
            let totalAttitude = 0;
            results.forEach(result => {
                totalEndurance += result.endurance || 3;
                totalTechnique += result.technique || 3;
                totalAttitude += result.attitude || 3;
            });
            const count = results.length;
            return {
                endurance: totalEndurance / count,
                technique: totalTechnique / count,
                attitude: totalAttitude / count,
                overall: (totalEndurance + totalTechnique + totalAttitude) / (3 * count),
                totalTrainings: count,
                lastTraining: results[0]?.training?.date
            };
        }
        catch (error) {
            this.logger.error(`❌ Error obteniendo rendimiento: ${error.message}`);
            return null;
        }
    }
};
exports.PlayerService = PlayerService;
exports.PlayerService = PlayerService = PlayerService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PlayerService);
//# sourceMappingURL=player.service.js.map