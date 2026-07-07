import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { GoogleGenAI, Type } from '@google/genai';

@Injectable()
export class GrievanceService {
  private ai: GoogleGenAI;

  constructor() {
    // Requires GEMINI_API_KEY to be set in environment
    this.ai = new GoogleGenAI({});
  }

  async analyzeGrievance(text: string) {
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
            type: Type.OBJECT,
            properties: {
              intent: { type: Type.STRING },
              priority: { type: Type.STRING },
              suggestedResolution: { type: Type.STRING },
            },
            required: ['intent', 'priority', 'suggestedResolution']
          }
        }
      });
      
      const responseText = response.text;
      if (!responseText) throw new Error('No response from AI');
      
      return JSON.parse(responseText);
    } catch (error) {
      console.error('Error analyzing grievance with Gemini:', error);
      throw new InternalServerErrorException('Failed to analyze grievance');
    }
  }
}
