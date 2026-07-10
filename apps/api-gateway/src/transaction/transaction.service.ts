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
  }

  async getUserNudges(deviceId: string) {
    // For the demo, we'll return all anomalies. In a real app, we'd filter by deviceId.
    const anomalies = await this.transactionRepo.find({
      where: { isAnomaly: true, deviceId }, // Filter by deviceId as intended
      order: { timestamp: 'DESC' },
      take: 5,
    });
    return anomalies;
  }

  async getTransactionsSince(deviceId: string, sinceTs: number) {
    const date = new Date(sinceTs);
    const allTx = await this.transactionRepo.find({
      where: { deviceId },
      order: { timestamp: 'DESC' },
    });
    // Filter manually as TypeORM between can be tricky with timestamps depending on driver
    return allTx.filter((a) => a.timestamp.getTime() > sinceTs);
  }

  async createTransaction(data: {
    amount: number;
    type: string;
    merchant: string;
    deviceId: string;
  }) {
    const timestamp = new Date();
    const hour = timestamp.getHours();

    let isAnomaly = false;
    let anomalyReason = '';

    // Rule 1: Time-of-day check (flag if outside 6 AM - 11 PM).
    if (hour < 6 || hour > 23) {
      isAnomaly = true;
      anomalyReason = `Transaction of ₹${data.amount} outside typical hours (${hour}:00).`;
    }

    // Rule 2: Rapid sequence (>= 3 transactions in 10 minutes)
    const tenMinsAgo = new Date(timestamp.getTime() - 10 * 60 * 1000);
    const recentTx = await this.transactionRepo
      .createQueryBuilder('tx')
      .where('tx.deviceId = :deviceId', { deviceId: data.deviceId })
      .andWhere('tx.timestamp >= :tenMinsAgo', { tenMinsAgo })
      .getCount();

    if (recentTx >= 2) {
      // The current one will be the 3rd
      isAnomaly = true;
      anomalyReason = `Rapid sequence: ${recentTx + 1} transactions within 10 minutes.`;
    }

    // Rule 3: Trailing 30-day average (flag if > 3x average)
    const thirtyDaysAgo = new Date(
      timestamp.getTime() - 30 * 24 * 60 * 60 * 1000,
    );
    const pastTx = await this.transactionRepo
      .createQueryBuilder('tx')
      .select('AVG(tx.amount)', 'avg')
      .where('tx.deviceId = :deviceId', { deviceId: data.deviceId })
      .andWhere('tx.timestamp >= :thirtyDaysAgo', { thirtyDaysAgo })
      .getRawOne();

    const average = parseFloat(pastTx.avg) || 0;
    if (average > 0 && data.amount > average * 3) {
      isAnomaly = true;
      anomalyReason = `Amount ₹${data.amount} is >3x your 30-day average (₹${average.toFixed(2)}).`;
    }

    const transaction = this.transactionRepo.create({
      ...data,
      timestamp,
      isAnomaly,
      anomalyReason: isAnomaly ? anomalyReason : undefined,
    });

    return this.transactionRepo.save(transaction);
  }
}
