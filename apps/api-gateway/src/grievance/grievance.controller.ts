import { Controller, Post, Body, Headers, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GrievanceService } from './grievance.service';
import { Grievance } from './entities/grievance.entity';

@Controller('grievance')
export class GrievanceController {
  constructor(
    private readonly grievanceService: GrievanceService,
    @InjectRepository(Grievance)
    private grievanceRepository: Repository<Grievance>,
  ) {}

  @Post('analyze')
  async analyze(
    @Body('text') text: string,
    @Headers('idempotency-key') idempotencyKey: string
  ) {
    if (!text) {
      throw new BadRequestException('Text is required');
    }
    if (!idempotencyKey) {
      throw new BadRequestException('Idempotency-Key header is required');
    }

    // Check if the idempotencyKey exists in the DB
    const existing = await this.grievanceRepository.findOne({ where: { idempotencyKey } });
    if (existing) {
      return {
        success: true,
        data: existing,
        idempotencyKey,
        cached: true,
      };
    }

    // Call Gemini API
    const analysis = await this.grievanceService.analyzeGrievance(text);
    
    // Save to DB
    const grievance = this.grievanceRepository.create({
      originalText: text,
      intent: analysis.intent,
      priority: analysis.priority,
      suggestedResolution: analysis.suggestedResolution,
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
}

