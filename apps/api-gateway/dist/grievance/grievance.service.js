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
exports.GrievanceService = void 0;
const common_1 = require("@nestjs/common");
const genai_1 = require("@google/genai");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const schedule_1 = require("@nestjs/schedule");
const grievance_entity_1 = require("./entities/grievance.entity");
let GrievanceService = class GrievanceService {
    grievanceRepo;
    ai;
    constructor(grievanceRepo) {
        this.grievanceRepo = grievanceRepo;
        this.ai = new genai_1.GoogleGenAI({});
    }
    redactPii(text) {
        let redacted = text.replace(/\b\d{10}\b/g, '[REDACTED PHONE]');
        redacted = redacted.replace(/\b\d{12,18}\b/g, '[REDACTED ACCOUNT]');
        return redacted;
    }
    async analyzeGrievance(text) {
        const sanitizedText = this.redactPii(text);
        try {
            const response = await this.ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: [
                    {
                        role: 'user',
                        parts: [{ text: `Analyze the following banking grievance and extract the intent, priority (HIGH, MEDIUM, LOW), suggested resolution steps, severity (1-5 where 5 is highest), and an etaBand (e.g., '24-48 hours').\n\nGrievance: ${sanitizedText}` }]
                    }
                ],
                config: {
                    temperature: 0.2,
                    responseMimeType: 'application/json',
                    responseSchema: {
                        type: genai_1.Type.OBJECT,
                        properties: {
                            intent: { type: genai_1.Type.STRING },
                            priority: { type: genai_1.Type.STRING },
                            suggestedResolution: { type: genai_1.Type.STRING },
                            severity: { type: genai_1.Type.INTEGER },
                            etaBand: { type: genai_1.Type.STRING },
                        },
                        required: ['intent', 'priority', 'suggestedResolution', 'severity', 'etaBand']
                    }
                }
            });
            const responseText = response.text;
            if (!responseText)
                throw new Error('No response from AI');
            return JSON.parse(responseText);
        }
        catch (error) {
            console.error('Error analyzing grievance with Gemini, using fallback:', error);
            return this.fallbackClassifier(sanitizedText);
        }
    }
    fallbackClassifier(text) {
        const lowerText = text.toLowerCase();
        let priority = 'LOW';
        let severity = 1;
        let etaBand = '5-7 days';
        let intent = 'General Inquiry';
        let suggestedResolution = 'Standard support routing.';
        if (lowerText.includes('fraud') || lowerText.includes('stolen') || lowerText.includes('unauthorized')) {
            priority = 'HIGH';
            severity = 5;
            etaBand = '24-48 hours';
            intent = 'Fraud Report';
            suggestedResolution = 'Immediately freeze account and contact customer.';
        }
        else if (lowerText.includes('failed') || lowerText.includes('pending') || lowerText.includes('declined')) {
            priority = 'MEDIUM';
            severity = 3;
            etaBand = '3-5 days';
            intent = 'Transaction Issue';
            suggestedResolution = 'Investigate transaction status with payment gateway.';
        }
        return {
            intent,
            priority,
            suggestedResolution,
            severity,
            etaBand
        };
    }
    async resolveGrievances() {
        const openGrievances = await this.grievanceRepo.find({ where: { status: 'OPEN' } });
        for (const g of openGrievances) {
            g.status = 'TRIAGED';
            await this.grievanceRepo.save(g);
        }
        const triagedGrievances = await this.grievanceRepo.find({ where: { status: 'TRIAGED' } });
        for (const g of triagedGrievances) {
            const timeSinceCreated = new Date().getTime() - g.createdAt.getTime();
            if (timeSinceCreated > 5 * 60 * 1000) {
                g.status = 'RESOLVED';
                await this.grievanceRepo.save(g);
            }
        }
    }
};
exports.GrievanceService = GrievanceService;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_MINUTE),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], GrievanceService.prototype, "resolveGrievances", null);
exports.GrievanceService = GrievanceService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(grievance_entity_1.Grievance)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], GrievanceService);
//# sourceMappingURL=grievance.service.js.map