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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const auth_service_1 = require("./auth.service");
const trust_event_entity_1 = require("./entities/trust-event.entity");
let AuthController = class AuthController {
    authService;
    trustRepository;
    constructor(authService, trustRepository) {
        this.authService = authService;
        this.trustRepository = trustRepository;
    }
    async login(username, deviceId) {
        if (!username || !deviceId) {
            throw new common_1.BadRequestException('Username and deviceId are required');
        }
        const trustResult = await this.authService.evaluateTrustScore(deviceId);
        return {
            success: true,
            requireOtp: !trustResult.trusted,
            trustReason: trustResult.reason,
            tempToken: 'demo-temp-token-' + username,
        };
    }
    async verifyOtp(otp, deviceId) {
        if (!otp || !deviceId) {
            throw new common_1.BadRequestException('OTP and deviceId are required');
        }
        if (otp !== '123456') {
            throw new common_1.UnauthorizedException('Invalid OTP');
        }
        await this.authService.recordTrustEvent(deviceId, 5, 'Successful OTP verification');
        return {
            success: true,
            token: 'demo-session-token-' + Math.random().toString(36).substring(7),
        };
    }
    async resetTrust(deviceId) {
        if (!deviceId) {
            throw new common_1.BadRequestException('deviceId is required');
        }
        await this.trustRepository.delete({ deviceId });
        return { success: true, message: 'Trust events cleared for device' };
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)('username')),
    __param(1, (0, common_1.Body)('deviceId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('verify-otp'),
    __param(0, (0, common_1.Body)('otp')),
    __param(1, (0, common_1.Body)('deviceId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verifyOtp", null);
__decorate([
    (0, common_1.Post)('reset-trust'),
    __param(0, (0, common_1.Body)('deviceId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "resetTrust", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __param(1, (0, typeorm_1.InjectRepository)(trust_event_entity_1.TrustEvent)),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        typeorm_2.Repository])
], AuthController);
//# sourceMappingURL=auth.controller.js.map