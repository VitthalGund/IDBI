import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { TrustEvent } from './entities/trust-event.entity';
export declare class AuthController {
    private readonly authService;
    private readonly jwtService;
    private trustRepository;
    constructor(authService: AuthService, jwtService: JwtService, trustRepository: Repository<TrustEvent>);
    login(username: string, password?: string, deviceId?: string): Promise<{
        success: boolean;
        requireOtp: boolean;
        trustReason: string;
        token: string | undefined;
        tempToken: string;
    }>;
    verifyOtp(username: string, otp: string, deviceId: string): Promise<{
        success: boolean;
        token: string;
    }>;
    resetTrust(deviceId: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
