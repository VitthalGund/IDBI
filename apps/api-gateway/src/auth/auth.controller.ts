import { Controller, Post, Body, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { TrustEvent } from './entities/trust-event.entity';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
    @InjectRepository(TrustEvent)
    private trustRepository: Repository<TrustEvent>,
  ) {}

  @Post('login')
  async login(
    @Body('username') username: string,
    @Body('password') password?: string,
    @Body('deviceId') deviceId?: string,
  ) {
    if (!username || !deviceId) {
      throw new BadRequestException('Username and deviceId are required');
    }

    // For Demo: we verify password (any non-empty password passes for demo)
    if (!password) {
      throw new UnauthorizedException('Password is required');
    }

    const trustResult = await this.authService.evaluateTrustScore(deviceId);
    let token = undefined;

    // If device is trusted, we skip OTP and issue a real token
    if (trustResult.trusted) {
      token = this.jwtService.sign({ username, sub: deviceId });
    }

    return {
      success: true,
      requireOtp: !trustResult.trusted,
      trustReason: trustResult.reason,
      token, // token is defined only if trusted
      tempToken: 'demo-temp-token-' + username, // kept for backward compatibility if needed during migration
    };
  }

  @Post('verify-otp')
  async verifyOtp(
    @Body('username') username: string,
    @Body('otp') otp: string,
    @Body('deviceId') deviceId: string,
  ) {
    if (!otp || !deviceId || !username) {
      throw new BadRequestException('Username, OTP and deviceId are required');
    }

    // Demo invariant: OTP is 123456
    if (otp !== '123456') {
      throw new UnauthorizedException('Invalid OTP');
    }

    // Success: Append a positive trust score to the device
    await this.authService.recordTrustEvent(deviceId, 5, 'Successful OTP verification');

    const token = this.jwtService.sign({ username, sub: deviceId });

    return {
      success: true,
      token,
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
