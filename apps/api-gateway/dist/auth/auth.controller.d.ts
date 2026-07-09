import { Repository } from 'typeorm';
import { AuthService } from './auth.service';
import { TrustEvent } from './entities/trust-event.entity';
export declare class AuthController {
    private readonly authService;
    private trustRepository;
    constructor(authService: AuthService, trustRepository: Repository<TrustEvent>);
    login(username: string, deviceId: string): Promise<{
        success: boolean;
        requireOtp: boolean;
        trustReason: string;
        tempToken: string;
    }>;
    verifyOtp(otp: string, deviceId: string): Promise<{
        success: boolean;
        token: string;
    }>;
    resetTrust(deviceId: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
