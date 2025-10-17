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
exports.CoachController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const coach_service_1 = require("./coach.service");
let CoachController = class CoachController {
    constructor(coachService) {
        this.coachService = coachService;
    }
    async getPlayers(req) {
        console.log('👥 GET /coach/players');
        return this.coachService.getPlayers(req.user?.userId);
    }
    async getTeamStats(req) {
        console.log('📊 GET /coach/stats');
        return this.coachService.getTeamStats(req.user?.userId);
    }
    async getCoachProfile(req) {
        console.log('👤 GET /coach/profile');
        return this.coachService.getCoachProfile(req.user?.userId);
    }
    async getCoachTrainings(req) {
        console.log('📅 GET /coach/trainings');
        return this.coachService.getCoachTrainings(req.user?.userId);
    }
    async createTraining(req, trainingData) {
        console.log('✅ POST /coach/trainings');
        const coachId = req.user?.userId;
        return this.coachService.createTraining(coachId, trainingData);
    }
    async updateTraining(req, trainingId, trainingData) {
        console.log('🎯 PUT /coach/trainings/:id - ID:', trainingId);
        console.log('📝 Datos:', trainingData);
        const coachId = req.user?.userId;
        const result = await this.coachService.updateTraining(trainingId, trainingData, coachId);
        console.log('✅ UPDATE EXITOSO');
        return result;
    }
    async deleteTraining(req, trainingId) {
        console.log('🗑️ DELETE /coach/trainings/:id - ID:', trainingId);
        const coachId = req.user?.userId;
        const result = await this.coachService.deleteTraining(trainingId, coachId);
        console.log('✅ DELETE EXITOSO');
        return result;
    }
    async saveTrainingResults(req, resultsData) {
        console.log('📝 POST /coach/training-results');
        console.log('📊 Datos recibidos:', resultsData);
        const coachId = req.user?.userId;
        return this.coachService.saveTrainingResults(coachId, resultsData);
    }
    async getTrainingResults(req, trainingId) {
        console.log('📋 GET /coach/training-results/:trainingId - ID:', trainingId);
        const coachId = req.user?.userId;
        return this.coachService.getTrainingResults(coachId, trainingId);
    }
    async updateTrainingResults(req, trainingId, resultsData) {
        console.log('🔄 PUT /coach/training-results/:trainingId - ID:', trainingId);
        console.log('📝 Datos:', resultsData);
        const coachId = req.user?.userId;
        return this.coachService.saveTrainingResults(coachId, resultsData);
    }
    async deleteTrainingResults(req, trainingId) {
        console.log('🗑️ DELETE /coach/training-results/:trainingId - ID:', trainingId);
        const coachId = req.user?.userId;
        return this.coachService.deleteTrainingResults(coachId, trainingId);
    }
    async getAllTrainingResults(req) {
        console.log('📋 GET /coach/training-results - Todos los resultados');
        const coachId = req.user?.userId;
        return this.coachService.getAllTrainingResults(coachId);
    }
};
exports.CoachController = CoachController;
__decorate([
    (0, common_1.Get)('players'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CoachController.prototype, "getPlayers", null);
__decorate([
    (0, common_1.Get)('stats'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CoachController.prototype, "getTeamStats", null);
__decorate([
    (0, common_1.Get)('profile'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CoachController.prototype, "getCoachProfile", null);
__decorate([
    (0, common_1.Get)('trainings'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CoachController.prototype, "getCoachTrainings", null);
__decorate([
    (0, common_1.Post)('trainings'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CoachController.prototype, "createTraining", null);
__decorate([
    (0, common_1.Put)('trainings/:id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Object]),
    __metadata("design:returntype", Promise)
], CoachController.prototype, "updateTraining", null);
__decorate([
    (0, common_1.Delete)('trainings/:id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], CoachController.prototype, "deleteTraining", null);
__decorate([
    (0, common_1.Post)('training-results'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CoachController.prototype, "saveTrainingResults", null);
__decorate([
    (0, common_1.Get)('training-results/:trainingId'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('trainingId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], CoachController.prototype, "getTrainingResults", null);
__decorate([
    (0, common_1.Put)('training-results/:trainingId'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('trainingId', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Object]),
    __metadata("design:returntype", Promise)
], CoachController.prototype, "updateTrainingResults", null);
__decorate([
    (0, common_1.Delete)('training-results/:trainingId'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('trainingId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], CoachController.prototype, "deleteTrainingResults", null);
__decorate([
    (0, common_1.Get)('training-results'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CoachController.prototype, "getAllTrainingResults", null);
exports.CoachController = CoachController = __decorate([
    (0, common_1.Controller)('coach'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __metadata("design:paramtypes", [coach_service_1.CoachService])
], CoachController);
//# sourceMappingURL=coach.controller.js.map