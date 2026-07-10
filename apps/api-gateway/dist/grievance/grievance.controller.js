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
exports.GrievanceController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const grievance_service_1 = require("./grievance.service");
const grievance_entity_1 = require("./entities/grievance.entity");
let GrievanceController = class GrievanceController {
    grievanceService;
    grievanceRepository;
    constructor(grievanceService, grievanceRepository) {
        this.grievanceService = grievanceService;
        this.grievanceRepository = grievanceRepository;
    }
    async analyze(text, idempotencyKey) {
        if (!text) {
            throw new common_1.BadRequestException('Text is required');
        }
        if (!idempotencyKey) {
            throw new common_1.BadRequestException('Idempotency-Key header is required');
        }
        const existing = await this.grievanceRepository.findOne({ where: { idempotencyKey } });
        if (existing) {
            return {
                success: true,
                data: existing,
                idempotencyKey,
                cached: true,
            };
        }
        const analysis = await this.grievanceService.analyzeGrievance(text);
        const internalDeadline = new Date();
        internalDeadline.setDate(internalDeadline.getDate() + 30);
        const grievance = this.grievanceRepository.create({
            originalText: text,
            intent: analysis.intent,
            priority: analysis.priority,
            suggestedResolution: analysis.suggestedResolution,
            severity: analysis.severity,
            etaBand: analysis.etaBand,
            internalDeadline,
            idempotencyKey,
            status: 'OPEN',
        });
        await this.grievanceRepository.save(grievance);
        return {
            success: true,
            data: grievance,
            idempotencyKey,
        };
    }
};
exports.GrievanceController = GrievanceController;
__decorate([
    (0, common_1.Post)('analyze'),
    __param(0, (0, common_1.Body)('text')),
    __param(1, (0, common_1.Headers)('idempotency-key')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], GrievanceController.prototype, "analyze", null);
exports.GrievanceController = GrievanceController = __decorate([
    (0, common_1.Controller)('grievance'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(1, (0, typeorm_1.InjectRepository)(grievance_entity_1.Grievance)),
    __metadata("design:paramtypes", [grievance_service_1.GrievanceService,
        typeorm_2.Repository])
], GrievanceController);
//# sourceMappingURL=grievance.controller.js.map