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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const player_service_1 = require("./player.service");
let PlayerController = class PlayerController {
    constructor(playerService) {
        this.playerService = playerService;
    }
    async getPlayerTrainings(req) {
        console.log('🎯 GET /player/trainings - Jugador ID:', req.user?.userId);
        return await this.playerService.getPlayerTrainings(req.user?.userId);
    }
    async getPlayerStats(req) {
        console.log('📊 GET /player/stats - Jugador ID:', req.user?.userId);
        return await this.playerService.getPlayerStats(req.user?.userId);
    }
    async getPlayerPerformance(req) {
        console.log('📈 GET /player/performance - Jugador ID:', req.user?.userId);
        return await this.playerService.getPlayerPerformance(req.user?.userId);
    }
    async debugEndpoint(req) {
        console.log('🐛 DEBUG /player/debug - Jugador ID:', req.user?.userId);
        const user = await this.playerService['prisma'].user.findUnique({
            where: { id: req.user?.userId }
        });
        const allTrainings = await this.playerService['prisma'].training.findMany({
            include: {
                participants: {
                    include: {
                        player: true
                    }
                },
                coach: true
            }
        });
        const playerTrainings = await this.playerService['prisma'].training.findMany({
            where: {
                participants: {
                    some: {
                        playerId: req.user?.userId
                    }
                }
            },
            include: {
                participants: {
                    include: {
                        player: true
                    }
                },
                coach: true
            }
        });
        return {
            message: 'Debug endpoint funcionando',
            user: user ? `${user.firstName} ${user.lastName} (${user.role})` : 'Usuario no encontrado',
            userId: req.user?.userId,
            allTrainingsCount: allTrainings.length,
            playerTrainingsCount: playerTrainings.length,
            allTrainings: allTrainings.map(t => ({
                id: t.id,
                title: t.title,
                date: t.date,
                participants: t.participants.map(p => `${p.player.firstName} ${p.player.lastName}`)
            })),
            playerTrainings: playerTrainings.map(t => ({
                id: t.id,
                title: t.title,
                date: t.date,
                participants: t.participants.map(p => `${p.player.firstName} ${p.player.lastName}`)
            }))
        };
    }
};
exports.PlayerController = PlayerController;
__decorate([
    (0, common_1.Get)('trainings'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PlayerController.prototype, "getPlayerTrainings", null);
__decorate([
    (0, common_1.Get)('stats'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PlayerController.prototype, "getPlayerStats", null);
__decorate([
    (0, common_1.Get)('performance'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PlayerController.prototype, "getPlayerPerformance", null);
__decorate([
    (0, common_1.Get)('debug'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PlayerController.prototype, "debugEndpoint", null);
exports.PlayerController = PlayerController = __decorate([
    (0, common_1.Controller)('player'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __metadata("design:paramtypes", [player_service_1.PlayerService])
], PlayerController);
//# sourceMappingURL=player.controller.js.map