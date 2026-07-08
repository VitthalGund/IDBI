import { Controller, Post, Body, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthService } from './auth.service';
import { TrustEvent } from './entities/trust-event.entity';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    @InjectRepository(TrustEvent)
    private trustRepository: Repository<TrustEvent>,
  ) {}

  @Post('login')
  async login(
    @Body('username') username: string,
    @Body('deviceId') deviceId: string,
  ) {
    if (!username || !deviceId) {
      throw new BadRequestException('Username and deviceId are required');
    }

    const trustResult = await this.authService.evaluateTrustScore(deviceId);

    // For Demo: Any username is accepted.
    // If device is trusted, we return requireOtp: false and skip OTP
    return {
      success: true,
      requireOtp: !trustResult.trusted,
      trustReason: trustResult.reason,
      tempToken: 'demo-temp-token-' + username,
    };
  }

  @Post('verify-otp')
  async verifyOtp(
    @Body('otp') otp: string,
    @Body('deviceId') deviceId: string,
  ) {
    if (!otp || !deviceId) {
      throw new BadRequestException('OTP and deviceId are required');
    }

    // Demo invariant: OTP is 123456
    if (otp !== '123456') {
      throw new UnauthorizedException('Invalid OTP');
    }

    // Success: Append a positive trust score to the device
    await this.authService.recordTrustEvent(deviceId, 5, 'Successful OTP verification');

    return {
      success: true,
      token: 'demo-session-token-' + Math.random().toString(36).substring(7),
    };
  }

  @Post('reset-trust')
  async resetTrust(@Body('deviceId') deviceId: string) {
    if (!deviceId) {
      throw new BadRequestException('deviceId is required');
    }
    // Delete all trust events for this device to reset demo state
    await this.trustRepository.delete({ deviceId });
    return { success: true, message: 'Trust events cleared for device' };
  }
}
