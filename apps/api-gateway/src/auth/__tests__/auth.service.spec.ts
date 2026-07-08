import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TrustEvent } from '../entities/trust-event.entity';

describe('AuthService', () => {
  let service: AuthService;
  let repository: any;

  beforeEach(async () => {
    const mockRepository = {
      find: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: getRepositoryToken(TrustEvent), useValue: mockRepository },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    repository = module.get(getRepositoryToken(TrustEvent));
  });

  it('evaluateTrustScore returns false and score=0 for no events', async () => {
    repository.find.mockResolvedValue([]);
    const res = await service.evaluateTrustScore('dev-123');
    expect(res.trusted).toBe(false);
    expect(res.score).toBe(0);
    expect(res.reason).toContain('New device detected');
  });

  it('evaluateTrustScore returns true when sum of scoreDelta >= 5', async () => {
    repository.find.mockResolvedValue([
      { scoreDelta: 2 },
      { scoreDelta: 3 },
    ]);
    const res = await service.evaluateTrustScore('dev-123');
    expect(res.trusted).toBe(true);
    expect(res.score).toBe(5);
  });

  it('recordTrustEvent calls create and save', async () => {
    const mockEvent = { deviceId: 'dev-123', scoreDelta: 5, reason: 'test' };
    repository.create.mockReturnValue(mockEvent);
    repository.save.mockResolvedValue(mockEvent);

    const res = await service.recordTrustEvent('dev-123', 5, 'test');
    expect(repository.create).toHaveBeenCalledWith(mockEvent);
    expect(repository.save).toHaveBeenCalledWith(mockEvent);
    expect(res).toEqual(mockEvent);
  });
});
