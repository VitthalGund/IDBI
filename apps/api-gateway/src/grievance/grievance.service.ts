import { Injectable } from '@nestjs/common';
import { GoogleGenAI, Type } from '@google/genai';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Grievance } from './entities/grievance.entity';

@Injectable()
export class GrievanceService {
  private ai: GoogleGenAI;

  constructor(
    @InjectRepository(Grievance)
    private grievanceRepo: Repository<Grievance>,
  ) {
    // Requires GEMINI_API_KEY to be set in environment
    this.ai = new GoogleGenAI({});
  }

  redactPii(text: string): string {
    let redacted = text.replace(/\b\d{10}\b/g, '[REDACTED PHONE]');
    redacted = redacted.replace(/\b\d{12,18}\b/g, '[REDACTED ACCOUNT]');
    return redacted;
  }

  async analyzeGrievance(text: string) {
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
            type: Type.OBJECT,
            properties: {
              intent: { type: Type.STRING },
              priority: { type: Type.STRING },
              suggestedResolution: { type: Type.STRING },
              severity: { type: Type.INTEGER },
              etaBand: { type: Type.STRING },
            },
            required: ['intent', 'priority', 'suggestedResolution', 'severity', 'etaBand']
          }
        }
      });
      
      const responseText = response.text;
      if (!responseText) throw new Error('No response from AI');
      
      return JSON.parse(responseText);
    } catch (error) {
      console.error('Error analyzing grievance with Gemini, using fallback:', error);
      return this.fallbackClassifier(sanitizedText);
    }
  }

  private fallbackClassifier(text: string) {
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
    } else if (lowerText.includes('failed') || lowerText.includes('pending') || lowerText.includes('declined')) {
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

  @Cron(CronExpression.EVERY_MINUTE)
  async resolveGrievances() {
    // Mock resolver: advance status of grievances over time
    const openGrievances = await this.grievanceRepo.find({ where: { status: 'OPEN' } });
    for (const g of openGrievances) {
      g.status = 'TRIAGED';
      await this.grievanceRepo.save(g);
    }

    const triagedGrievances = await this.grievanceRepo.find({ where: { status: 'TRIAGED' } });
    for (const g of triagedGrievances) {
      // If it's been TRIAGED for a bit, maybe resolve it in a real app.
      // Here we will just resolve them for the demo's sake, simulating a timeline.
      const timeSinceCreated = new Date().getTime() - g.createdAt.getTime();
      if (timeSinceCreated > 5 * 60 * 1000) { // 5 minutes mock
        g.status = 'RESOLVED';
        await this.grievanceRepo.save(g);
      }
    }
  }
}
