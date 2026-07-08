import { Controller, Get, Query } from '@nestjs/common';
import { TransactionService } from './transaction.service';

@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Get('nudges')
  async getNudges(@Query('deviceId') deviceId: string) {
    const nudges = await this.transactionService.getUserNudges(deviceId);
    return nudges;
  }
}
