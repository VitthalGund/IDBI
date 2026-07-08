import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TrustEvent } from './entities/trust-event.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(TrustEvent)
    private trustRepository: Repository<TrustEvent>,
  ) {}

  async evaluateTrustScore(deviceId: string): Promise<{ score: number; trusted: boolean; reason: string }> {
    const events = await this.trustRepository.find({ where: { deviceId } });
    const score = events.reduce((sum, e) => sum + e.scoreDelta, 0);
    
    const threshold = 5;
    const trusted = score >= threshold;
    let reason = '';
    
    if (trusted) {
      reason = `Device fingerprint matches. Past successful MFA logins established a high trust score (${score}/${threshold}).`;
    } else if (events.length === 0) {
      reason = `New device detected. OTP required to establish device trust.`;
    } else {
      reason = `Device trust score is low (${score}/${threshold}). Step-up OTP required.`;
    }

    return { score, trusted, reason };
  }

  async recordTrustEvent(deviceId: string, delta: number, reason: string): Promise<TrustEvent> {
    const event = this.trustRepository.create({
      deviceId,
      scoreDelta: delta,
      reason,
    });
    return this.trustRepository.save(event);
  }
}
