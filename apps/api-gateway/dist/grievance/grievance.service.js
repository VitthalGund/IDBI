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
exports.GrievanceService = void 0;
const common_1 = require("@nestjs/common");
const genai_1 = require("@google/genai");
let GrievanceService = class GrievanceService {
    ai;
    constructor() {
        this.ai = new genai_1.GoogleGenAI({});
    }
    async analyzeGrievance(text) {
        try {
            const response = await this.ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: [
                    {
                        role: 'user',
                        parts: [{ text: `Analyze the following banking grievance and extract the intent, priority (HIGH, MEDIUM, LOW), and suggested resolution steps.\n\nGrievance: ${text}` }]
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
                        },
                        required: ['intent', 'priority', 'suggestedResolution']
                    }
                }
            });
            const responseText = response.text;
            if (!responseText)
                throw new Error('No response from AI');
            return JSON.parse(responseText);
        }
        catch (error) {
            console.error('Error analyzing grievance with Gemini:', error);
            throw new common_1.InternalServerErrorException('Failed to analyze grievance');
        }
    }
};
exports.GrievanceService = GrievanceService;
exports.GrievanceService = GrievanceService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], GrievanceService);
//# sourceMappingURL=grievance.service.js.map