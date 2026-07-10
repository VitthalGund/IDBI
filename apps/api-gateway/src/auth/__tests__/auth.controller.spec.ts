import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import { AccountService } from '../../account/account.service';
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
        { provide: JwtService, useValue: { sign: () => 'mock-jwt-token' } },
        { provide: AccountService, useValue: { getAccount: jest.fn() } },
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

    const res = await controller.login('admin', 'password', 'dev-123');
    expect(res.requireOtp).toBe(true);
    expect(res.trustReason).toBe('mock reason');
  });

  it('login skips otp if device trusted', async () => {
    (service.evaluateTrustScore as jest.Mock).mockResolvedValue({
      score: 5,
      trusted: true,
      reason: 'mock reason',
    });

    const res = await controller.login('admin', 'password', 'dev-123');
    expect(res.requireOtp).toBe(false);
  });

  it('verifyOtp records event and returns token on 123456', async () => {
    const result = await controller.verifyOtp('demouser', '123456', 'device-untrusted');
    expect(result.success).toBe(true);
    expect(result.token).toContain('mock-jwt-token');
    expect(service.recordTrustEvent).toHaveBeenCalledWith('device-untrusted', 5, 'Successful OTP verification');
  });

  it('verifyOtp throws UnauthorizedException on incorrect OTP', async () => {
    await expect(controller.verifyOtp('demouser', '000000', 'device-untrusted')).rejects.toThrow(UnauthorizedException);
  });
});
