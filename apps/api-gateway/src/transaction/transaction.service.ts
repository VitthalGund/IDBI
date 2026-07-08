import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from './entities/transaction.entity';

@Injectable()
export class TransactionService implements OnModuleInit {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepo: Repository<Transaction>,
  ) {}

  async onModuleInit() {
    // Seed some mock transactions for the demo
    const count = await this.transactionRepo.count();
    if (count === 0) {
      await this.seedTransactions();
    }
  }

  private async seedTransactions() {
    const defaultDeviceId = 'mock-device-id'; // Can be matched with mobile's default
    const now = new Date();
    
    // Normal transaction
    await this.transactionRepo.save({
      amount: 1500,
      type: 'debit',
      merchant: 'Amazon',
      timestamp: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
      deviceId: defaultDeviceId,
      isAnomaly: false,
    });

    // Normal transaction
    await this.transactionRepo.save({
      amount: 5000,
      type: 'credit',
      merchant: 'Salary',
      timestamp: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 5), // 5 days ago
      deviceId: defaultDeviceId,
      isAnomaly: false,
    });

    // Anomaly: Huge amount at weird time (e.g., 2 AM)
    const weirdTime = new Date();
    weirdTime.setHours(2, 15, 0, 0); // 2:15 AM
    
    await this.transactionRepo.save({
      amount: 85000,
      type: 'debit',
      merchant: 'Unknown Crypto Exchange',
      timestamp: weirdTime,
      deviceId: defaultDeviceId,
      isAnomaly: true,
      anomalyReason: 'Unusually large amount (₹85,000) at unusual hour (2:15 AM).',
    });
  }

  async getUserNudges(deviceId: string) {
    // For the demo, we'll return all anomalies. In a real app, we'd filter by deviceId.
    const anomalies = await this.transactionRepo.find({
      where: { isAnomaly: true },
      order: { timestamp: 'DESC' },
      take: 5,
    });
    return anomalies;
  }
}
