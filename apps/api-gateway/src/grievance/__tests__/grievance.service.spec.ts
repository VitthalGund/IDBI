import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { GrievanceService } from '../grievance.service';
import { Grievance } from '../entities/grievance.entity';

// Mock the GoogleGenAI module
jest.mock('@google/genai', () => {
  return {
    GoogleGenAI: jest.fn().mockImplementation(() => {
      return {
        models: {
          generateContent: jest.fn().mockResolvedValue({
            text: JSON.stringify({
              intent: 'COMPLAINT',
              priority: 'HIGH',
              suggestedResolution: 'Refund immediately',
              severity: 5,
              etaBand: '24-48 hours',
            }),
          }),
        },
      };
    }),
    Type: {
      OBJECT: 'OBJECT',
      STRING: 'STRING',
    },
  };
});

describe('GrievanceService', () => {
  let service: GrievanceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GrievanceService,
        { provide: getRepositoryToken(Grievance), useValue: {} },
      ],
    }).compile();

    service = module.get<GrievanceService>(GrievanceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should analyze grievance text and parse JSON correctly', async () => {
    const result = await service.analyzeGrievance('I lost my money');

    expect(result).toEqual({
      intent: 'COMPLAINT',
      priority: 'HIGH',
      suggestedResolution: 'Refund immediately',
      severity: 5,
      etaBand: '24-48 hours',
    });
  });
});
