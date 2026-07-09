import { Repository } from 'typeorm';
import { TrustEvent } from './entities/trust-event.entity';
export declare class AuthService {
    private trustRepository;
    constructor(trustRepository: Repository<TrustEvent>);
    evaluateTrustScore(deviceId: string): Promise<{
        score: number;
        trusted: boolean;
        reason: string;
    }>;
    recordTrustEvent(deviceId: string, delta: number, reason: string): Promise<TrustEvent>;
}
