import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TrustEvent } from '../entities/trust-event.entity';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;
  let repository: any;

  beforeEach(async () => {
    const mockService = {
      evaluateTrustScore: jest.fn(),
      recordTrustEvent: jest.fn(),
    };

    const mockRepository = {
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: mockService },
        { provide: getRepositoryToken(TrustEvent), useValue: mockRepository },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
    repository = module.get(getRepositoryToken(TrustEvent));
  });

  it('login requires otp if device not trusted', async () => {
    (service.evaluateTrustScore as jest.Mock).mockResolvedValue({
      score: 0,
      trusted: false,
      reason: 'mock reason',
    });

    const res = await controller.login('admin', 'dev-123');
    expect(res.requireOtp).toBe(true);
    expect(res.trustReason).toBe('mock reason');
  });

  it('login skips otp if device trusted', async () => {
    (service.evaluateTrustScore as jest.Mock).mockResolvedValue({
      score: 5,
      trusted: true,
      reason: 'mock reason',
    });

    const res = await controller.login('admin', 'dev-123');
    expect(res.requireOtp).toBe(false);
  });

  it('verifyOtp records event and returns token on 123456', async () => {
    const res = await controller.verifyOtp('123456', 'dev-123');
    expect(res.success).toBe(true);
    expect(res.token).toContain('demo-session-token');
    expect(service.recordTrustEvent).toHaveBeenCalledWith('dev-123', 5, 'Successful OTP verification');
  });

  it('verifyOtp throws UnauthorizedException on incorrect OTP', async () => {
    await expect(controller.verifyOtp('000000', 'dev-123')).rejects.toThrow(UnauthorizedException);
  });
});
