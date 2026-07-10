import { Test, TestingModule } from '@nestjs/testing';
import { GrievanceController } from '../grievance.controller';
import { GrievanceService } from '../grievance.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Grievance } from '../entities/grievance.entity';
import { BadRequestException } from '@nestjs/common';

describe('GrievanceController', () => {
  let controller: GrievanceController;
  let service: GrievanceService;
  let repository: any;

  beforeEach(async () => {
    const mockService = {
      analyzeGrievance: jest.fn(),
    };

    const mockRepository = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [GrievanceController],
      providers: [
        { provide: GrievanceService, useValue: mockService },
        { provide: getRepositoryToken(Grievance), useValue: mockRepository },
      ],
    }).compile();

    controller = module.get<GrievanceController>(GrievanceController);
    service = module.get<GrievanceService>(GrievanceService);
    repository = module.get(getRepositoryToken(Grievance));
  });

  it('should return cached grievance if idempotencyKey exists', async () => {
    const mockExisting = { id: '123', intent: 'COMPLAINT' };
    repository.findOne.mockResolvedValue(mockExisting);

    const result = await controller.analyze('test text', 'mock-key');

    expect(repository.findOne).toHaveBeenCalledWith({
      where: { idempotencyKey: 'mock-key' },
    });
    expect(result).toEqual({
      success: true,
      data: mockExisting,
      idempotencyKey: 'mock-key',
      cached: true,
    });
    expect(service.analyzeGrievance).not.toHaveBeenCalled();
  });

  it('should analyze and save new grievance if idempotencyKey is new', async () => {
    repository.findOne.mockResolvedValue(null);
    const mockAnalysis = {
      intent: 'INQUIRY',
      priority: 'LOW',
      suggestedResolution: 'Check FAQ',
    };
    (service.analyzeGrievance as jest.Mock).mockResolvedValue(mockAnalysis);

    const mockCreated = {
      ...mockAnalysis,
      idempotencyKey: 'new-key',
      originalText: 'help',
    };
    repository.create.mockReturnValue(mockCreated);
    repository.save.mockResolvedValue(mockCreated);

    const result = await controller.analyze('help', 'new-key');

    expect(service.analyzeGrievance).toHaveBeenCalledWith('help');
    expect(repository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        originalText: 'help',
        intent: 'INQUIRY',
        priority: 'LOW',
        suggestedResolution: 'Check FAQ',
        idempotencyKey: 'new-key',
        status: 'OPEN',
      }),
    );
    expect(repository.save).toHaveBeenCalledWith(mockCreated);
    expect(result).toEqual({
      success: true,
      data: mockCreated,
      idempotencyKey: 'new-key',
    });
  });

  it('should throw BadRequestException if text is missing', async () => {
    await expect(controller.analyze('', 'key')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should throw BadRequestException if idempotencyKey is missing', async () => {
    await expect(controller.analyze('text', '')).rejects.toThrow(
      BadRequestException,
    );
  });
});
